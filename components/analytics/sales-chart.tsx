"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface SalesChartProps {
  data: Array<{
    date: string
    total_sales: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  // Format data for chart
  const chartData = data
    .slice(0, 30)
    .reverse()
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sales: Number.parseFloat(item.total_sales.toString()),
    }))

  const totalSales = data.reduce((sum, item) => sum + Number.parseFloat(item.total_sales.toString()), 0)
  const avgDailySales = data.length > 0 ? totalSales / data.length : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Sales Trend
        </CardTitle>
        <CardDescription>Daily sales over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">${avgDailySales.toFixed(2)} average daily sales</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Sales"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
