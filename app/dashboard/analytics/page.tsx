import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import Link from "next/link"
import { SalesChart } from "@/components/analytics/sales-chart"
import { OrdersChart } from "@/components/analytics/orders-chart"
import { TopProductsChart } from "@/components/analytics/top-products-chart"
import { CustomerInsights } from "@/components/analytics/customer-insights"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's stores
  const { data: stores } = await supabase.from("stores").select("*").eq("user_id", user.id).eq("is_active", true)

  if (!stores || stores.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect your first Shopify store to start viewing analytics.
            </p>
            <Link href="/dashboard/stores/new">
              <Button>Connect Store</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const storeIds = stores.map((store) => store.id)

  // Fetch analytics data
  const [
    { data: totalSalesData },
    { data: totalOrdersData },
    { data: totalCustomersData },
    { data: totalProductsData },
    { data: recentOrders },
    { data: salesSummary },
  ] = await Promise.all([
    supabase.from("orders").select("total_price").in("store_id", storeIds).eq("financial_status", "paid"),
    supabase.from("orders").select("id", { count: "exact" }).in("store_id", storeIds),
    supabase.from("customers").select("id", { count: "exact" }).in("store_id", storeIds),
    supabase.from("products").select("id", { count: "exact" }).in("store_id", storeIds),
    supabase.from("orders").select("*").in("store_id", storeIds).order("processed_at", { ascending: false }).limit(10),
    supabase
      .from("analytics_summary")
      .select("*")
      .in("store_id", storeIds)
      .order("date", { ascending: false })
      .limit(30),
  ])

  // Calculate metrics
  const totalRevenue = totalSalesData?.reduce((sum, order) => sum + (Number.parseFloat(order.total_price) || 0), 0) || 0
  const totalOrders = totalOrdersData?.length || 0
  const totalCustomers = totalCustomersData?.length || 0
  const totalProducts = totalProductsData?.length || 0
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

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
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              </div>
            </div>
            <Badge variant="outline">{stores.length} stores connected</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All-time revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Unique customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SalesChart data={salesSummary || []} />
          <OrdersChart data={salesSummary || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TopProductsChart storeIds={storeIds} />
          <CustomerInsights storeIds={storeIds} />
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders across all your stores</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{order.order_number}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.email}</p>
                      <p className="text-xs text-gray-500">{new Date(order.processed_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total_price}</p>
                      <Badge variant={order.financial_status === "paid" ? "default" : "secondary"} className="text-xs">
                        {order.financial_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No recent orders found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
