-- Create profiles bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('profiles', 'profiles')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow staff to upload profile pictures
CREATE POLICY "Staff can upload profile pictures" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  )
);

-- Create policy to allow staff to update profile pictures
CREATE POLICY "Staff can update profile pictures" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'profiles' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  )
);

-- Create policy to allow everyone to view profile pictures
CREATE POLICY "Anyone can view profile pictures" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'profiles');
