-- Create storage bucket for menu images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true);

-- Create policy for viewing menu images
CREATE POLICY "Anyone can view menu images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'menu-images');

-- Create policy for admin to upload menu images
CREATE POLICY "Admins can upload menu images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'menu-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin to update menu images
CREATE POLICY "Admins can update menu images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'menu-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin to delete menu images
CREATE POLICY "Admins can delete menu images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'menu-images' AND has_role(auth.uid(), 'admin'::app_role));