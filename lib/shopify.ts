// Shopify API client utilities
export interface ShopifyProduct {
  id: number
  title: string
  handle: string
  vendor: string
  product_type: string
  status: string
  tags: string
  variants: Array<{
    id: number
    price: string
    compare_at_price?: string
    inventory_quantity: number
  }>
  created_at: string
  updated_at: string
}

export interface ShopifyOrder {
  id: number
  order_number: string
  email: string
  total_price: string
  subtotal_price: string
  total_tax: string
  shipping_lines: Array<{
    price: string
  }>
  financial_status: string
  fulfillment_status?: string
  customer?: {
    id: number
  }
  line_items: Array<{
    id: number
    quantity: number
  }>
  processed_at: string
  created_at: string
  updated_at: string
}

export interface ShopifyCustomer {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  total_spent: string
  orders_count: number
  state: string
  created_at: string
  updated_at: string
}

export class ShopifyAPI {
  private shopDomain: string
  private accessToken: string

  constructor(shopDomain: string, accessToken: string) {
    this.shopDomain = shopDomain
    this.accessToken = accessToken
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `https://${this.shopDomain}/admin/api/2023-10/${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "X-Shopify-Access-Token": this.accessToken,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getProducts(limit = 250): Promise<ShopifyProduct[]> {
    const data = await this.makeRequest(`products.json?limit=${limit}`)
    return data.products || []
  }

  async getOrders(limit = 250): Promise<ShopifyOrder[]> {
    const data = await this.makeRequest(`orders.json?limit=${limit}&status=any`)
    return data.orders || []
  }

  async getCustomers(limit = 250): Promise<ShopifyCustomer[]> {
    const data = await this.makeRequest(`customers.json?limit=${limit}`)
    return data.customers || []
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest("shop.json")
      return true
    } catch {
      return false
    }
  }
}

// Demo data generators for stores without real API access
export function generateDemoProducts(storeId: string, count = 10): any[] {
  const productTypes = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Beauty"]
  const vendors = ["Demo Corp", "Sample Inc", "Test Ltd", "Example Co", "Mock LLC"]
  const statuses = ["active", "draft"]

  return Array.from({ length: count }, (_, i) => ({
    store_id: storeId,
    shopify_product_id: 1000 + i,
    title: `Demo Product ${i + 1}`,
    handle: `demo-product-${i + 1}`,
    vendor: vendors[i % vendors.length],
    product_type: productTypes[i % productTypes.length],
    status: statuses[i % statuses.length],
    tags: ["demo", "sample", productTypes[i % productTypes.length].toLowerCase()],
    price: (Math.random() * 100 + 10).toFixed(2),
    compare_at_price: (Math.random() * 150 + 50).toFixed(2),
    inventory_quantity: Math.floor(Math.random() * 100),
  }))
}

export function generateDemoOrders(storeId: string, count = 20): any[] {
  const statuses = ["paid", "pending", "refunded"]
  const fulfillmentStatuses = ["fulfilled", "pending", "shipped"]

  return Array.from({ length: count }, (_, i) => ({
    store_id: storeId,
    shopify_order_id: 2000 + i,
    order_number: `#${1000 + i}`,
    email: `customer${i + 1}@example.com`,
    total_price: (Math.random() * 200 + 20).toFixed(2),
    subtotal_price: (Math.random() * 180 + 15).toFixed(2),
    tax_price: (Math.random() * 20 + 2).toFixed(2),
    shipping_price: (Math.random() * 15 + 5).toFixed(2),
    financial_status: statuses[i % statuses.length],
    fulfillment_status: fulfillmentStatuses[i % fulfillmentStatuses.length],
    customer_id: 3000 + (i % 10),
    line_items_count: Math.floor(Math.random() * 5) + 1,
    processed_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

export function generateDemoCustomers(storeId: string, count = 15): any[] {
  const firstNames = ["John", "Jane", "Mike", "Sarah", "David", "Lisa", "Tom", "Emma", "Chris", "Anna"]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]

  return Array.from({ length: count }, (_, i) => ({
    store_id: storeId,
    shopify_customer_id: 3000 + i,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[i % lastNames.length],
    phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    total_spent: (Math.random() * 1000 + 50).toFixed(2),
    orders_count: Math.floor(Math.random() * 10) + 1,
    state: "enabled",
  }))
}
