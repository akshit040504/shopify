-- Insert dummy users (these will be created through auth, but we need them for foreign key references)
-- Note: In production, users are created through Supabase Auth, but for demo purposes we'll create some dummy data

-- Insert dummy stores
INSERT INTO public.stores (id, user_id, store_name, shop_domain, access_token, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', auth.uid(), 'Demo Fashion Store', 'demo-fashion.myshopify.com', 'dummy_token_1', true),
('550e8400-e29b-41d4-a716-446655440002', auth.uid(), 'Tech Gadgets Hub', 'tech-gadgets.myshopify.com', 'dummy_token_2', true)
ON CONFLICT (user_id, shop_domain) DO NOTHING;

-- Insert dummy products
INSERT INTO public.products (store_id, shopify_product_id, title, handle, vendor, product_type, status, tags, price, compare_at_price, inventory_quantity) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1001, 'Premium Cotton T-Shirt', 'premium-cotton-tshirt', 'Fashion Co', 'Apparel', 'active', ARRAY['clothing', 'cotton', 'casual'], 29.99, 39.99, 150),
('550e8400-e29b-41d4-a716-446655440001', 1002, 'Denim Jeans', 'denim-jeans', 'Fashion Co', 'Apparel', 'active', ARRAY['clothing', 'denim', 'pants'], 79.99, 99.99, 75),
('550e8400-e29b-41d4-a716-446655440001', 1003, 'Summer Dress', 'summer-dress', 'Fashion Co', 'Apparel', 'active', ARRAY['clothing', 'dress', 'summer'], 59.99, 79.99, 50),
('550e8400-e29b-41d4-a716-446655440002', 2001, 'Wireless Headphones', 'wireless-headphones', 'Tech Corp', 'Electronics', 'active', ARRAY['electronics', 'audio', 'wireless'], 199.99, 249.99, 100),
('550e8400-e29b-41d4-a716-446655440002', 2002, 'Smartphone Case', 'smartphone-case', 'Tech Corp', 'Accessories', 'active', ARRAY['electronics', 'accessories', 'protection'], 24.99, 34.99, 200),
('550e8400-e29b-41d4-a716-446655440002', 2003, 'Portable Charger', 'portable-charger', 'Tech Corp', 'Electronics', 'active', ARRAY['electronics', 'charging', 'portable'], 49.99, 59.99, 120)
ON CONFLICT (store_id, shopify_product_id) DO NOTHING;

-- Insert dummy customers
INSERT INTO public.customers (store_id, shopify_customer_id, email, first_name, last_name, phone, total_spent, orders_count, state) VALUES
('550e8400-e29b-41d4-a716-446655440001', 3001, 'john.doe@example.com', 'John', 'Doe', '+1234567890', 159.97, 2, 'enabled'),
('550e8400-e29b-41d4-a716-446655440001', 3002, 'jane.smith@example.com', 'Jane', 'Smith', '+1234567891', 89.98, 1, 'enabled'),
('550e8400-e29b-41d4-a716-446655440002', 4001, 'mike.johnson@example.com', 'Mike', 'Johnson', '+1234567892', 274.97, 3, 'enabled'),
('550e8400-e29b-41d4-a716-446655440002', 4002, 'sarah.wilson@example.com', 'Sarah', 'Wilson', '+1234567893', 49.99, 1, 'enabled')
ON CONFLICT (store_id, shopify_customer_id) DO NOTHING;

-- Insert dummy orders
INSERT INTO public.orders (store_id, shopify_order_id, order_number, email, total_price, subtotal_price, tax_price, shipping_price, financial_status, fulfillment_status, customer_id, line_items_count, processed_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 5001, '#1001', 'john.doe@example.com', 89.98, 79.98, 6.40, 3.60, 'paid', 'fulfilled', 3001, 2, NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440001', 5002, '#1002', 'john.doe@example.com', 69.99, 59.99, 5.60, 4.40, 'paid', 'fulfilled', 3001, 1, NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440001', 5003, '#1003', 'jane.smith@example.com', 89.98, 79.98, 6.40, 3.60, 'paid', 'pending', 3002, 2, NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 6001, '#2001', 'mike.johnson@example.com', 224.98, 199.98, 16.00, 9.00, 'paid', 'fulfilled', 4001, 1, NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440002', 6002, '#2002', 'mike.johnson@example.com', 49.99, 44.99, 3.60, 1.40, 'paid', 'fulfilled', 4001, 2, NOW() - INTERVAL '4 days'),
('550e8400-e29b-41d4-a716-446655440002', 6003, '#2003', 'sarah.wilson@example.com', 49.99, 44.99, 3.60, 1.40, 'paid', 'pending', 4002, 1, NOW() - INTERVAL '2 days')
ON CONFLICT (store_id, shopify_order_id) DO NOTHING;

-- Insert dummy analytics summary
INSERT INTO public.analytics_summary (store_id, date, total_sales, total_orders, total_customers, average_order_value) VALUES
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '7 days', 89.98, 1, 1, 89.98),
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '3 days', 69.99, 1, 1, 69.99),
('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 89.98, 1, 1, 89.98),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '7 days', 224.98, 1, 1, 224.98),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '4 days', 49.99, 1, 1, 49.99),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '2 days', 49.99, 1, 1, 49.99)
ON CONFLICT (store_id, date) DO NOTHING;
