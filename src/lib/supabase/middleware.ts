import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Refresh session if expired - required for Server Components
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // If no session and trying to access dashboard routes
    if (request.nextUrl.pathname.startsWith("/(dashboard)") && userError) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If has session and trying to access auth routes
    if (request.nextUrl.pathname.startsWith("/(auth)") && user) {
      // Get user's role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile) {
        // If no profile exists, log out the user and redirect to login
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Redirect based on role from profiles table
      let redirectPath = '/admin'; // Default for admin role
      if (profile.role === 'staff') {
        redirectPath = '/branch';
      } else if (profile.role === 'store') {
        redirectPath = '/store';
      } else if (profile.role === 'beneficiary') {
        redirectPath = '/beneficiary';
      }

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return response;
  } catch (e) {
    // If Supabase client creation fails, redirect to login
    if (request.nextUrl.pathname.startsWith("/(dashboard)")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};