-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'store', 'beneficiary');

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone_number TEXT,
    email TEXT,
    role user_role NOT NULL,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create branches table
CREATE TABLE branches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    plus_code TEXT NOT NULL,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staff table
CREATE TABLE staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, branch_id)
);

-- Create stores table
CREATE TABLE stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    plus_code TEXT NOT NULL,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create beneficiaries table
CREATE TABLE beneficiaries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    registered_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    otp TEXT NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Function to handle beneficiary profile creation
CREATE OR REPLACE FUNCTION handle_beneficiary_profile()
RETURNS trigger AS $$
BEGIN
  -- Only create beneficiary record if the profile is a beneficiary
  IF NEW.role = 'beneficiary' THEN
    INSERT INTO public.beneficiaries (profile_id, branch_id, registered_by)
    VALUES (
      NEW.id,
      -- Get the branch_id of the staff member who created the profile
      (
        SELECT branch_id 
        FROM public.staff 
        WHERE profile_id = auth.uid()
      ),
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for beneficiary creation
CREATE TRIGGER on_beneficiary_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_beneficiary_profile();

-- Profiles policies

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profile
    WHERE admin_profile.id = auth.uid()
    AND admin_profile.role = 'admin'
  )
);

CREATE POLICY "Staff can view beneficiary profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  (
    -- Staff member accessing the profile
    EXISTS (
      SELECT 1 FROM profiles staff_profile
      WHERE staff_profile.id = auth.uid()
      AND staff_profile.role = 'staff'
    )
    AND
    -- Target profile must be a beneficiary
    role = 'beneficiary'
  )
);

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());


CREATE POLICY "admins can create profiles, staff can create beneficiary profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
  OR
  -- Allow staff to create only beneficiary profiles
  (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() 
      AND role = 'staff'
    )
    AND role = 'beneficiary'
  )
);

CREATE POLICY "Only admins can delete profiles"
ON profiles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "admins can update any profile, staff can update beneficiary profiles except role"
ON profiles FOR UPDATE
TO authenticated
USING (
  -- Check if user is admin or staff updating a beneficiary
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND (
      role = 'admin' 
      OR (
        role = 'staff' 
        AND EXISTS (
          SELECT 1 FROM profiles p2
          WHERE p2.id = profiles.id 
          AND p2.role = 'beneficiary'
        )
      )
    )
  )
)
WITH CHECK (
  -- Admin can do anything
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR
  -- Staff can only update beneficiary profiles and can't change roles
  (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'staff'
    )
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = profiles.id 
      AND p2.role = 'beneficiary'
    )
  )
);

-- Create updated_at function and trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at
    BEFORE UPDATE ON branches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficiaries_updated_at
    BEFORE UPDATE ON beneficiaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
