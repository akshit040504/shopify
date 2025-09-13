"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TenantSettingsProps {
  settings: Record<string, any>
}

export function TenantSettings({ settings }: TenantSettingsProps) {
  const [formData, setFormData] = useState({
    sync_frequency: settings.sync_frequency?.interval || "hourly",
    auto_sync: settings.sync_frequency?.auto_sync ?? true,
    data_retention_days: settings.data_retention?.days || 365,
    auto_cleanup: settings.data_retention?.auto_cleanup ?? false,
    dashboard_theme: settings.dashboard_preferences?.theme || "light",
    default_view: settings.dashboard_preferences?.default_view || "overview",
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

      // Update sync frequency settings
      await supabase.from("tenant_settings").upsert(
        {
          user_id: user.id,
          setting_key: "sync_frequency",
          setting_value: {
            interval: formData.sync_frequency,
            auto_sync: formData.auto_sync,
          },
        },
        { onConflict: "user_id,setting_key" },
      )

      // Update data retention settings
      await supabase.from("tenant_settings").upsert(
        {
          user_id: user.id,
          setting_key: "data_retention",
          setting_value: {
            days: formData.data_retention_days,
            auto_cleanup: formData.auto_cleanup,
          },
        },
        { onConflict: "user_id,setting_key" },
      )

      // Update dashboard preferences
      await supabase.from("tenant_settings").upsert(
        {
          user_id: user.id,
          setting_key: "dashboard_preferences",
          setting_value: {
            theme: formData.dashboard_theme,
            default_view: formData.default_view,
          },
        },
        { onConflict: "user_id,setting_key" },
      )

      setMessage({ type: "success", text: "Settings updated successfully!" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update settings",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sync Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Data Sync Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sync_frequency">Sync Frequency</Label>
            <Select
              value={formData.sync_frequency}
              onValueChange={(value) => setFormData({ ...formData, sync_frequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Every Hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto_sync"
              checked={formData.auto_sync}
              onCheckedChange={(checked) => setFormData({ ...formData, auto_sync: checked })}
            />
            <Label htmlFor="auto_sync">Enable automatic sync</Label>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Data Retention</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="retention_days">Retention Period (Days)</Label>
            <Select
              value={formData.data_retention_days.toString()}
              onValueChange={(value) => setFormData({ ...formData, data_retention_days: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="180">6 Months</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
                <SelectItem value="730">2 Years</SelectItem>
                <SelectItem value="-1">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto_cleanup"
              checked={formData.auto_cleanup}
              onCheckedChange={(checked) => setFormData({ ...formData, auto_cleanup: checked })}
            />
            <Label htmlFor="auto_cleanup">Auto-cleanup old data</Label>
          </div>
        </div>
      </div>

      {/* Dashboard Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dashboard Preferences</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={formData.dashboard_theme}
              onValueChange={(value) => setFormData({ ...formData, dashboard_theme: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_view">Default View</Label>
            <Select
              value={formData.default_view}
              onValueChange={(value) => setFormData({ ...formData, default_view: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="stores">Stores</SelectItem>
                <SelectItem value="products">Products</SelectItem>
              </SelectContent>
            </Select>
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
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}
