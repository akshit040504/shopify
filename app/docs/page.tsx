import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Key, Shield, Zap, BookOpen, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete guide to the ShopifySync API and integration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">v1.0.0</Badge>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Auth</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="sdks">SDKs</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="h-5 w-5 mr-2 text-blue-600" />
                      ShopifySync API
                    </CardTitle>
                    <CardDescription>
                      A comprehensive multi-tenant API for Shopify data ingestion, analytics, and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      The ShopifySync API provides a robust platform for connecting multiple Shopify stores, ingesting
                      data in real-time, and generating powerful analytics insights. Built with enterprise-grade
                      security and multi-tenant architecture.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Enterprise Security</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Real-time Sync</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Multi-tenant</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Base URL</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <code className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm">
                        https://api.shopifysync.com/v1
                      </code>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Rate Limits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Standard:</span>
                          <span>1000 req/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Premium:</span>
                          <span>5000 req/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Enterprise:</span>
                          <span>Unlimited</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Start</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">1. Get your API key</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Sign up for an account and generate your API key from the dashboard.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">2. Connect your Shopify store</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Use the stores endpoint to connect your Shopify store with your access token.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">3. Start syncing data</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Trigger data sync and start receiving analytics insights.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Authentication */}
            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-green-600" />
                    Authentication
                  </CardTitle>
                  <CardDescription>Secure your API requests with proper authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">API Key Authentication</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      All API requests must include your API key in the Authorization header:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <code className="text-sm">
                        {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.shopifysync.com/v1/stores`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Getting Your API Key</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        1. Log in to your ShopifySync dashboard
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2. Navigate to Settings → API Keys</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">3. Generate a new API key</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">4. Copy and securely store your key</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Security Best Practices</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Never expose API keys in client-side code</li>
                      <li>• Use environment variables to store keys</li>
                      <li>• Rotate keys regularly</li>
                      <li>• Use HTTPS for all API requests</li>
                      <li>• Implement proper error handling</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Endpoints */}
            <TabsContent value="endpoints" className="space-y-6">
              <div className="grid gap-6">
                {/* Stores Endpoints */}
                <Card>
                  <CardHeader>
                    <CardTitle>Stores</CardTitle>
                    <CardDescription>Manage your connected Shopify stores</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            GET
                          </Badge>
                          <code className="text-sm">/stores</code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">List all connected stores</p>
                      </div>

                      <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            POST
                          </Badge>
                          <code className="text-sm">/stores</code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connect a new Shopify store</p>
                        <div className="mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs">
                          <pre>{`{
  "store_name": "My Store",
  "shop_domain": "mystore.myshopify.com",
  "access_token": "shpat_..."
}`}</pre>
                        </div>
                      </div>

                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            GET
                          </Badge>
                          <code className="text-sm">/stores/{`{id}`}</code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get store details</p>
                      </div>

                      <div className="border-l-4 border-orange-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            PUT
                          </Badge>
                          <code className="text-sm">/stores/{`{id}`}</code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Update store configuration</p>
                      </div>

                      <div className="border-l-4 border-red-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            DELETE
                          </Badge>
                          <code className="text-sm">/stores/{`{id}`}</code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Disconnect store</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sync Endpoints */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Sync</CardTitle>
                    <CardDescription>Trigger and manage data synchronization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          POST
                        </Badge>
                        <code className="text-sm">/sync/{`{store_id}`}</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sync data for a specific store</p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          POST
                        </Badge>
                        <code className="text-sm">/sync/all</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sync data for all connected stores</p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          GET
                        </Badge>
                        <code className="text-sm">/sync/status/{`{store_id}`}</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get sync status for a store</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Analytics Endpoints */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>Access analytics data and insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          GET
                        </Badge>
                        <code className="text-sm">/analytics/overview</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get overview analytics across all stores
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          GET
                        </Badge>
                        <code className="text-sm">/analytics/sales</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get sales analytics with date range</p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          GET
                        </Badge>
                        <code className="text-sm">/analytics/products/top</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get top performing products</p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          GET
                        </Badge>
                        <code className="text-sm">/analytics/customers/segments</code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get customer segmentation data</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Webhooks */}
            <TabsContent value="webhooks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>Real-time notifications for data changes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Available Events</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <code className="text-sm font-medium">sync.completed</code>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Fired when data sync completes</p>
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <code className="text-sm font-medium">sync.failed</code>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Fired when data sync fails</p>
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <code className="text-sm font-medium">store.connected</code>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Fired when a new store is connected
                          </p>
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <code className="text-sm font-medium">analytics.updated</code>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Fired when analytics are updated</p>
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Webhook Configuration</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <code className="text-sm">
                        {`POST /webhooks
{
  "url": "https://your-app.com/webhooks/shopifysync",
  "events": ["sync.completed", "sync.failed"],
  "secret": "your-webhook-secret"
}`}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Webhook Payload Example</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <pre className="text-sm">
                        {`{
  "event": "sync.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "store_id": "uuid-here",
    "store_name": "My Store",
    "sync_results": {
      "products": 150,
      "orders": 45,
      "customers": 32
    }
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Examples */}
            <TabsContent value="examples" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Code Examples</CardTitle>
                    <CardDescription>Common integration patterns and examples</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">JavaScript/Node.js</h3>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <pre className="text-sm">
                          {`const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.shopifysync.com/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

// Connect a new store
async function connectStore(storeData) {
  try {
    const response = await client.post('/stores', storeData);
    console.log('Store connected:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Trigger sync
async function syncStore(storeId) {
  try {
    const response = await client.post(\`/sync/\${storeId}\`);
    console.log('Sync started:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Python</h3>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <pre className="text-sm">
                          {`import requests

class ShopifySyncClient:
    def __init__(self, api_key):
        self.base_url = 'https://api.shopifysync.com/v1'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def connect_store(self, store_data):
        response = requests.post(
            f'{self.base_url}/stores',
            json=store_data,
            headers=self.headers
        )
        return response.json()
    
    def sync_store(self, store_id):
        response = requests.post(
            f'{self.base_url}/sync/{store_id}',
            headers=self.headers
        )
        return response.json()
    
    def get_analytics(self, params=None):
        response = requests.get(
            f'{self.base_url}/analytics/overview',
            params=params,
            headers=self.headers
        )
        return response.json()

# Usage
client = ShopifySyncClient('YOUR_API_KEY')
result = client.sync_store('store-uuid-here')`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">cURL</h3>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <pre className="text-sm">
                          {`# Connect a new store
curl -X POST https://api.shopifysync.com/v1/stores \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "store_name": "My Store",
    "shop_domain": "mystore.myshopify.com",
    "access_token": "shpat_..."
  }'

# Trigger sync
curl -X POST https://api.shopifysync.com/v1/sync/STORE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Get analytics
curl -X GET https://api.shopifysync.com/v1/analytics/overview \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SDKs */}
            <TabsContent value="sdks" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Official SDKs</CardTitle>
                    <CardDescription>Use our official SDKs for faster integration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Code className="h-8 w-8 text-yellow-600" />
                          <div>
                            <h3 className="font-semibold">JavaScript SDK</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">For Node.js and browser</p>
                          </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                          <code className="text-sm">npm install @shopifysync/sdk</code>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on GitHub
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Code className="h-8 w-8 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">Python SDK</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">For Python applications</p>
                          </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                          <code className="text-sm">pip install shopifysync-python</code>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on GitHub
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Code className="h-8 w-8 text-red-600" />
                          <div>
                            <h3 className="font-semibold">Ruby SDK</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">For Ruby on Rails</p>
                          </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                          <code className="text-sm">gem install shopifysync</code>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on GitHub
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Code className="h-8 w-8 text-purple-600" />
                          <div>
                            <h3 className="font-semibold">PHP SDK</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">For PHP applications</p>
                          </div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                          <code className="text-sm">composer require shopifysync/php-sdk</code>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on GitHub
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="justify-start bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Discord Community
                      </Button>
                      <Button variant="outline" className="justify-start bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Stack Overflow
                      </Button>
                      <Button variant="outline" className="justify-start bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        GitHub Issues
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
