"use server"
import { createClient } from "@/lib/supabase/service_role";
import { z } from "zod";
import { formSchema } from "../schema";

export async function registerAction(values: z.infer<typeof formSchema>) {
    const validatedValues = formSchema.parse(values)
    
    const supabase = await createClient()
    supabase.auth.signUp({
        email: validatedValues.email,
        password: validatedValues.password,
        options: {
            data: {
                full_name: validatedValues.full_name,
                phone_number: validatedValues.phone_number,
                role: validatedValues.role
            }
        }  
    })

}