-- Create users table for multi-tenant support
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table for Shopify store connections
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  shop_domain TEXT NOT NULL,
  access_token TEXT,
  webhook_secret TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, shop_domain)
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  shopify_product_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  handle TEXT,
  vendor TEXT,
  product_type TEXT,
  status TEXT,
  tags TEXT[],
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  inventory_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, shopify_product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  shopify_order_id BIGINT NOT NULL,
  order_number TEXT,
  email TEXT,
  total_price DECIMAL(10,2),
  subtotal_price DECIMAL(10,2),
  tax_price DECIMAL(10,2),
  shipping_price DECIMAL(10,2),
  financial_status TEXT,
  fulfillment_status TEXT,
  customer_id BIGINT,
  line_items_count INTEGER DEFAULT 0,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, shopify_order_id)
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  shopify_customer_id BIGINT NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, shopify_customer_id)
);

-- Create analytics_summary table for pre-computed metrics
CREATE TABLE IF NOT EXISTS public.analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for stores table
CREATE POLICY "Users can view their own stores" ON public.stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own stores" ON public.stores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stores" ON public.stores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stores" ON public.stores FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for products table
CREATE POLICY "Users can view products from their stores" ON public.products FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can insert products to their stores" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can update products in their stores" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can delete products from their stores" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.user_id = auth.uid())
);

-- Create RLS policies for orders table
CREATE POLICY "Users can view orders from their stores" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can insert orders to their stores" ON public.orders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can update orders in their stores" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid())
);

-- Create RLS policies for customers table
CREATE POLICY "Users can view customers from their stores" ON public.customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = customers.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can insert customers to their stores" ON public.customers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = customers.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can update customers in their stores" ON public.customers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = customers.store_id AND stores.user_id = auth.uid())
);

-- Create RLS policies for analytics_summary table
CREATE POLICY "Users can view analytics from their stores" ON public.analytics_summary FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = analytics_summary.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can insert analytics to their stores" ON public.analytics_summary FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = analytics_summary.store_id AND stores.user_id = auth.uid())
);
CREATE POLICY "Users can update analytics in their stores" ON public.analytics_summary FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = analytics_summary.store_id AND stores.user_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON public.stores(user_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_customers_store_id ON public.customers(store_id);
CREATE INDEX IF NOT EXISTS idx_analytics_summary_store_id ON public.analytics_summary(store_id);
CREATE INDEX IF NOT EXISTS idx_analytics_summary_date ON public.analytics_summary(date);
