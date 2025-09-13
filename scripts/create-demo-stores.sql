-- Create 5 demo stores with realistic data
-- First ensure we have a demo user
INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@example.com',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert the demo user into our users table
INSERT INTO public.users (id, email, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@example.com',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create 5 demo stores
INSERT INTO stores (
  id,
  user_id,
  shop_domain,
  store_name,
  contact_email,
  access_token,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'trendy-fashion-boutique.myshopify.com',
  'Trendy Fashion Boutique',
  'contact@trendyfashion.com',
  'demo_token_' || extract(epoch from now()),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'tech-gadgets-store.myshopify.com',
  'Tech Gadgets Store',
  'support@techgadgets.com',
  'demo_token_' || extract(epoch from now()),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'organic-wellness-shop.myshopify.com',
  'Organic Wellness Shop',
  'hello@organicwellness.com',
  'demo_token_' || extract(epoch from now()),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'home-decor-paradise.myshopify.com',
  'Home Decor Paradise',
  'info@homedecorparadise.com',
  'demo_token_' || extract(epoch from now()),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'sports-equipment-hub.myshopify.com',
  'Sports Equipment Hub',
  'team@sportsequipment.com',
  'demo_token_' || extract(epoch from now()),
  NOW(),
  NOW()
)
ON CONFLICT (user_id, shop_domain) DO NOTHING;
