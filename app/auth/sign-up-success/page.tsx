import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ShopifySync</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Please check your email and click the confirmation link to activate your ShopifySync account. Once
              confirmed, you&apos;ll be able to sign in and start connecting your Shopify stores.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
