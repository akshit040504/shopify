import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ShopifyAPI, generateDemoProducts, generateDemoOrders, generateDemoCustomers } from "@/lib/shopify"

export async function POST(request: NextRequest, { params }: { params: Promise<{ storeId: string }> }) {
  try {
    const { storeId } = await params
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get store details
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .eq("user_id", user.id)
      .single()

    if (storeError || !store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const syncResults = {
      products: 0,
      orders: 0,
      customers: 0,
      errors: [] as string[],
    }

    // If store has access token, try to sync from real Shopify API
    if (store.access_token) {
      try {
        const shopify = new ShopifyAPI(store.shop_domain, store.access_token)

        // Test connection first
        const isConnected = await shopify.testConnection()
        if (!isConnected) {
          throw new Error("Failed to connect to Shopify API")
        }

        // Sync products
        const products = await shopify.getProducts()
        for (const product of products) {
          const productData = {
            store_id: storeId,
            shopify_product_id: product.id,
            title: product.title,
            handle: product.handle,
            vendor: product.vendor,
            product_type: product.product_type,
            status: product.status,
            tags: product.tags.split(", "),
            price: product.variants[0]?.price || "0",
            compare_at_price: product.variants[0]?.compare_at_price || null,
            inventory_quantity: product.variants[0]?.inventory_quantity || 0,
          }

          await supabase.from("products").upsert(productData, {
            onConflict: "store_id,shopify_product_id",
          })
          syncResults.products++
        }

        // Sync orders
        const orders = await shopify.getOrders()
        for (const order of orders) {
          const orderData = {
            store_id: storeId,
            shopify_order_id: order.id,
            order_number: order.order_number,
            email: order.email,
            total_price: order.total_price,
            subtotal_price: order.subtotal_price,
            tax_price: order.total_tax,
            shipping_price: order.shipping_lines[0]?.price || "0",
            financial_status: order.financial_status,
            fulfillment_status: order.fulfillment_status || null,
            customer_id: order.customer?.id || null,
            line_items_count: order.line_items.length,
            processed_at: order.processed_at,
          }

          await supabase.from("orders").upsert(orderData, {
            onConflict: "store_id,shopify_order_id",
          })
          syncResults.orders++
        }

        // Sync customers
        const customers = await shopify.getCustomers()
        for (const customer of customers) {
          const customerData = {
            store_id: storeId,
            shopify_customer_id: customer.id,
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
            total_spent: customer.total_spent,
            orders_count: customer.orders_count,
            state: customer.state,
          }

          await supabase.from("customers").upsert(customerData, {
            onConflict: "store_id,shopify_customer_id",
          })
          syncResults.customers++
        }
      } catch (error) {
        console.error("Shopify API sync error:", error)
        syncResults.errors.push(`Shopify API error: ${error instanceof Error ? error.message : "Unknown error"}`)

        // Fall back to demo data if API fails
        await syncDemoData(supabase, storeId, syncResults)
      }
    } else {
      // Use demo data for stores without access tokens
      await syncDemoData(supabase, storeId, syncResults)
    }

    // Update analytics summary
    await updateAnalyticsSummary(supabase, storeId)

    return NextResponse.json({
      success: true,
      message: "Data sync completed",
      results: syncResults,
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

async function syncDemoData(supabase: any, storeId: string, syncResults: any) {
  // Generate and insert demo products
  const demoProducts = generateDemoProducts(storeId, 15)
  for (const product of demoProducts) {
    await supabase.from("products").upsert(product, {
      onConflict: "store_id,shopify_product_id",
    })
    syncResults.products++
  }

  // Generate and insert demo orders
  const demoOrders = generateDemoOrders(storeId, 25)
  for (const order of demoOrders) {
    await supabase.from("orders").upsert(order, {
      onConflict: "store_id,shopify_order_id",
    })
    syncResults.orders++
  }

  // Generate and insert demo customers
  const demoCustomers = generateDemoCustomers(storeId, 20)
  for (const customer of demoCustomers) {
    await supabase.from("customers").upsert(customer, {
      onConflict: "store_id,shopify_customer_id",
    })
    syncResults.customers++
  }
}

async function updateAnalyticsSummary(supabase: any, storeId: string) {
  // Get orders from the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("total_price, processed_at")
    .eq("store_id", storeId)
    .eq("financial_status", "paid")
    .gte("processed_at", thirtyDaysAgo.toISOString())

  if (recentOrders && recentOrders.length > 0) {
    // Group orders by date
    const ordersByDate = recentOrders.reduce((acc: any, order: any) => {
      const date = new Date(order.processed_at).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = { totalSales: 0, orderCount: 0 }
      }
      acc[date].totalSales += Number.parseFloat(order.total_price) || 0
      acc[date].orderCount += 1
      return acc
    }, {})

    // Insert/update analytics summary for each date
    for (const [date, stats] of Object.entries(ordersByDate)) {
      const { totalSales, orderCount } = stats as any
      await supabase.from("analytics_summary").upsert(
        {
          store_id: storeId,
          date,
          total_sales: totalSales,
          total_orders: orderCount,
          average_order_value: totalSales / orderCount,
        },
        { onConflict: "store_id,date" },
      )
    }
  }
}
