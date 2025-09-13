import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Store, Package, ShoppingCart, Users, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"

interface StorePageProps {
  params: Promise<{ id: string }>
}

export default async function StorePage({ params }: StorePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch store details
  const { data: store } = await supabase.from("stores").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!store) {
    redirect("/dashboard")
  }

  // Fetch store statistics
  const [
    { data: products, count: productCount },
    { data: orders, count: orderCount },
    { data: customers, count: customerCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact" }).eq("store_id", id).limit(5),
    supabase.from("orders").select("*", { count: "exact" }).eq("store_id", id).limit(5),
    supabase.from("customers").select("*", { count: "exact" }).eq("store_id", id).limit(5),
  ])

  // Calculate total revenue
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_price")
    .eq("store_id", id)
    .eq("financial_status", "paid")

  const totalRevenue = revenueData?.reduce((sum, order) => sum + (Number.parseFloat(order.total_price) || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Store className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{store.store_name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{store.shop_domain}</p>
                </div>
              </div>
            </div>
            <Badge variant={store.is_active ? "default" : "secondary"}>{store.is_active ? "Active" : "Inactive"}</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Store Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All-time revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productCount || 0}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerCount || 0}</div>
              <p className="text-xs text-muted-foreground">Unique customers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Recent Products
              </CardTitle>
              <CardDescription>Latest products in your store</CardDescription>
            </CardHeader>
            <CardContent>
              {products && products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{product.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${product.price}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.inventory_quantity} in stock
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No products found</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{order.order_number}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total_price}</p>
                        <Badge
                          variant={order.financial_status === "paid" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {order.financial_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No orders found</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recent Customers
              </CardTitle>
              <CardDescription>Latest customers in your store</CardDescription>
            </CardHeader>
            <CardContent>
              {customers && customers.length > 0 ? (
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">
                          {customer.first_name} {customer.last_name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${customer.total_spent}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{customer.orders_count} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No customers found</p>
              )}
            </CardContent>
          </Card>

          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Store Name</label>
                <p className="text-sm">{store.store_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Domain</label>
                <p className="text-sm">{store.shop_domain}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <p className="text-sm">
                  <Badge variant={store.is_active ? "default" : "secondary"}>
                    {store.is_active ? "Active" : "Inactive"}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Connected</label>
                <p className="text-sm">{new Date(store.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
