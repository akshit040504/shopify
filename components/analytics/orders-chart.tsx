"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ShoppingCart } from "lucide-react"

interface OrdersChartProps {
  data: Array<{
    date: string
    total_orders: number
  }>
}

export function OrdersChart({ data }: OrdersChartProps) {
  // Format data for chart
  const chartData = data
    .slice(0, 30)
    .reverse()
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      orders: item.total_orders,
    }))

  const totalOrders = data.reduce((sum, item) => sum + item.total_orders, 0)
  const avgDailyOrders = data.length > 0 ? totalOrders / data.length : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
          Orders Trend
        </CardTitle>
        <CardDescription>Daily orders over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-sm text-muted-foreground">{avgDailyOrders.toFixed(1)} average daily orders</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [value, "Orders"]} labelFormatter={(label) => `Date: ${label}`} />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
