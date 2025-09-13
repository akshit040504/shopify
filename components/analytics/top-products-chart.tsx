"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Package } from "lucide-react"

interface TopProductsChartProps {
  storeIds: string[]
}

export function TopProductsChart({ storeIds }: TopProductsChartProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate top products data
        const mockProducts = [
          { title: "Premium T-Shirt", sales: 45, revenue: 1347.55 },
          { title: "Wireless Headphones", sales: 32, revenue: 6399.68 },
          { title: "Denim Jeans", sales: 28, revenue: 2239.72 },
          { title: "Summer Dress", sales: 24, revenue: 1439.76 },
          { title: "Smartphone Case", sales: 22, revenue: 549.78 },
        ]
        setProducts(mockProducts)
      } catch (error) {
        console.error("Failed to fetch top products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (storeIds.length > 0) {
      fetchTopProducts()
    } else {
      setLoading(false)
    }
  }, [storeIds])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2 text-purple-600" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2 text-purple-600" />
          Top Products
        </CardTitle>
        <CardDescription>Best selling products by quantity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={products} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="title" type="category" width={100} />
              <Tooltip
                formatter={(value, name) => [
                  name === "sales" ? `${value} units` : `$${Number(value).toFixed(2)}`,
                  name === "sales" ? "Units Sold" : "Revenue",
                ]}
              />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
