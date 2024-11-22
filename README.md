# Aid Project

This project is built with Next.js and Supabase, providing a secure authentication system and user management.

## Prerequisites

- Node.js (v22 or later)
- pnpm
- Docker (for local Supabase development)

## Getting Started


1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up Supabase locally**
   ```bash
   # Start Supabase services
   pnpm supabase start
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the following variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   Open [http://localhost:3000/login](http://localhost:3000/login) in your browser

## Default Admin Credentials

After seeding the database, you can login with:
- Email: admin@example.com
- Password: password123

**Important**: Change these credentials after first login!

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication routes
│   │   │   ├── login/       # Login page
│   │   │   └── layout.tsx   # Auth layout
│   │   ├── (dashboard)/     # Dashboard routes
│   │   │   ├── admin/       # Admin section
│   │   │   ├── staff/      # Branch management
│   │   │   ├── store/       # Store management
│   │   │   └── layout.tsx   # Dashboard layout
│   │   ├── fonts/          # Font configurations
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   │
│   ├── components/         # Reusable components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── register/      # Registration components
│   │   │   ├── actions/   # Server actions
│   │   │   └── schema.ts  # Form validation
│   │   └── ui/           # UI components (shadcn)
│   │
│   └── lib/              # Utility functions
│       ├── supabase/     # Supabase client configuration
│       └── utils.ts      # Helper functions
│
├── public/              # Static files
│
├── supabase/           # Supabase configuration
│   ├── migrations/     # Database migrations
│   ├── config.toml    # Supabase config
│   └── seed.sql       # Database seed data
│
├── .env               # Environment variables
├── .env.example       # Example environment variables
├── middleware.ts      # Next.js middleware
├── next.config.ts     # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── components.json    # Shadcn UI components configuration
└── package.json       # Project dependencies and scripts
```

