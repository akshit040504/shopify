import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, RefreshCw, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { SyncButton } from "@/components/sync-button"

export default async function SyncPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's stores
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

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
              <Database className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Data Sync</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Sync All Stores */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-blue-600" />
                Sync All Stores
              </CardTitle>
              <CardDescription>
                Sync data from all your connected Shopify stores at once. This will update products, orders, and
                customers across all stores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stores?.length || 0} stores will be synced
                  </p>
                </div>
                <div className="w-64">
                  <SyncButton />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Store Sync */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Individual Store Sync</h2>

            {stores && stores.length > 0 ? (
              <div className="grid gap-6">
                {stores.map((store) => (
                  <Card key={store.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{store.store_name}</CardTitle>
                          <CardDescription>{store.shop_domain}</CardDescription>
                        </div>
                        <Badge variant={store.is_active ? "default" : "secondary"}>
                          {store.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            Last updated: {new Date(store.updated_at).toLocaleString()}
                          </div>
                          <div className="flex items-center text-sm">
                            {store.access_token ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                API Connected
                              </div>
                            ) : (
                              <div className="flex items-center text-orange-600">
                                <Database className="h-4 w-4 mr-1" />
                                Demo Mode
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-64">
                          <SyncButton storeId={store.id} storeName={store.store_name} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No stores connected</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Connect your first Shopify store to start syncing data.
                  </p>
                  <Link href="/dashboard/stores/new">
                    <Button>Connect Your First Store</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sync Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How Data Sync Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Automatic Sync</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data is automatically synced every hour for stores with valid API credentials. Manual sync is
                  available anytime.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Demo Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stores without API credentials will use demo data to showcase the platform's capabilities. This is
                  perfect for testing and demonstrations.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Types</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We sync products, orders, customers, and generate analytics summaries. All data is stored securely
                  with multi-tenant isolation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
