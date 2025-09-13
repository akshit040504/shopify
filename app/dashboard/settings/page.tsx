import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, User, Shield, Bell, Database } from "lucide-react"
import Link from "next/link"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { TenantSettings } from "@/components/settings/tenant-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch tenant settings
  const { data: tenantSettings } = await supabase.from("tenant_settings").select("*").eq("user_id", user.id)

  // Convert settings array to object for easier access
  const settings =
    tenantSettings?.reduce(
      (acc, setting) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      },
      {} as Record<string, any>,
    ) || {}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Account Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Profile Information
                </CardTitle>
                <CardDescription>Manage your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSettings user={user} profile={profile} />
              </CardContent>
            </Card>

            {/* Tenant Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-green-600" />
                  Data & Sync Settings
                </CardTitle>
                <CardDescription>Configure how your Shopify data is synced and stored</CardDescription>
              </CardHeader>
              <CardContent>
                <TenantSettings settings={settings} />
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings settings={settings.notifications || {}} />
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-600" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your account security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent>
                <SecuritySettings user={user} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
