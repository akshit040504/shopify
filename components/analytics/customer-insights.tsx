"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Users } from "lucide-react"

interface CustomerInsightsProps {
  storeIds: string[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function CustomerInsights({ storeIds }: CustomerInsightsProps) {
  const [customerData, setCustomerData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomerInsights() {
      try {
        // In a real app, this would be an API call to analyze customer segments
        // For demo purposes, we'll simulate customer segmentation data
        const mockData = [
          { name: "New Customers", value: 35, count: 42 },
          { name: "Returning Customers", value: 28, count: 34 },
          { name: "VIP Customers", value: 20, count: 24 },
          { name: "At-Risk Customers", value: 12, count: 14 },
          { name: "Inactive Customers", value: 5, count: 6 },
        ]
        setCustomerData(mockData)
      } catch (error) {
        console.error("Failed to fetch customer insights:", error)
      } finally {
        setLoading(false)
      }
    }

    if (storeIds.length > 0) {
      fetchCustomerInsights()
    } else {
      setLoading(false)
    }
  }, [storeIds])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-orange-600" />
            Customer Segments
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
          <Users className="h-5 w-5 mr-2 text-orange-600" />
          Customer Segments
        </CardTitle>
        <CardDescription>Customer distribution by behavior</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
