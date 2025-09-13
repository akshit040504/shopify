-- Add contact_email field to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Update customers table to support simple name/email creation
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.customers ALTER COLUMN shopify_customer_id DROP NOT NULL;
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_store_id_shopify_customer_id_key;

-- Create new unique constraint that allows NULL shopify_customer_id
CREATE UNIQUE INDEX IF NOT EXISTS customers_store_shopify_id_unique 
ON public.customers(store_id, shopify_customer_id) 
WHERE shopify_customer_id IS NOT NULL;

-- Add index for customer name and email searches
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(customer_name);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
