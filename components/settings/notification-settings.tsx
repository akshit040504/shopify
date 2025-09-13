"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface NotificationSettingsProps {
  settings: Record<string, any>
}

export function NotificationSettings({ settings }: NotificationSettingsProps) {
  const [formData, setFormData] = useState({
    email: settings.email ?? true,
    push: settings.push ?? false,
    sync_alerts: settings.sync_alerts ?? true,
    order_alerts: settings.order_alerts ?? true,
    inventory_alerts: settings.inventory_alerts ?? false,
    weekly_reports: settings.weekly_reports ?? true,
    monthly_reports: settings.monthly_reports ?? true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      await supabase.from("tenant_settings").upsert(
        {
          user_id: user.id,
          setting_key: "notifications",
          setting_value: formData,
        },
        { onConflict: "user_id,setting_key" },
      )

      setMessage({ type: "success", text: "Notification settings updated successfully!" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update notification settings",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Communication Preferences</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email">Email Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
            </div>
            <Switch
              id="email"
              checked={formData.email}
              onCheckedChange={(checked) => setFormData({ ...formData, email: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in your browser</p>
            </div>
            <Switch
              id="push"
              checked={formData.push}
              onCheckedChange={(checked) => setFormData({ ...formData, push: checked })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Alert Types</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sync_alerts">Sync Alerts</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when data sync completes or fails</p>
            </div>
            <Switch
              id="sync_alerts"
              checked={formData.sync_alerts}
              onCheckedChange={(checked) => setFormData({ ...formData, sync_alerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order_alerts">Order Alerts</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified about new orders and order updates
              </p>
            </div>
            <Switch
              id="order_alerts"
              checked={formData.order_alerts}
              onCheckedChange={(checked) => setFormData({ ...formData, order_alerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="inventory_alerts">Inventory Alerts</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when products are low in stock</p>
            </div>
            <Switch
              id="inventory_alerts"
              checked={formData.inventory_alerts}
              onCheckedChange={(checked) => setFormData({ ...formData, inventory_alerts: checked })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Reports</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly_reports">Weekly Reports</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive weekly performance summaries</p>
            </div>
            <Switch
              id="weekly_reports"
              checked={formData.weekly_reports}
              onCheckedChange={(checked) => setFormData({ ...formData, weekly_reports: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="monthly_reports">Monthly Reports</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive monthly analytics reports</p>
            </div>
            <Switch
              id="monthly_reports"
              checked={formData.monthly_reports}
              onCheckedChange={(checked) => setFormData({ ...formData, monthly_reports: checked })}
            />
          </div>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Notification Settings"}
      </Button>
    </form>
  )
}
