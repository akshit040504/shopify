"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface SyncButtonProps {
  storeId?: string
  storeName?: string
  onSyncComplete?: () => void
}

export function SyncButton({ storeId, storeName, onSyncComplete }: SyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSync = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const endpoint = storeId ? `/api/sync/${storeId}` : "/api/sync/all"
      const response = await fetch(endpoint, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Sync failed")
      }

      setResult(data)
      onSyncComplete?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleSync} disabled={isLoading} className="w-full">
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Syncing..." : `Sync ${storeId ? storeName || "Store" : "All Stores"}`}
      </Button>

      {result && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Sync completed successfully!</strong>
            <br />
            {storeId ? (
              <>
                Products: {result.results?.products || 0}, Orders: {result.results?.orders || 0}, Customers:{" "}
                {result.results?.customers || 0}
              </>
            ) : (
              <>Synced {result.results?.length || 0} stores</>
            )}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Sync failed:</strong> {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
