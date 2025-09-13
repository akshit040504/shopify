import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all user's stores
    const { data: stores, error: storesError } = await supabase
      .from("stores")
      .select("id, store_name, shop_domain")
      .eq("user_id", user.id)
      .eq("is_active", true)

    if (storesError) {
      return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
    }

    if (!stores || stores.length === 0) {
      return NextResponse.json({ message: "No active stores found" })
    }

    const syncResults = []

    // Sync each store
    for (const store of stores) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/sync/${store.id}`, {
          method: "POST",
          headers: {
            Authorization: request.headers.get("Authorization") || "",
            Cookie: request.headers.get("Cookie") || "",
          },
        })

        const result = await response.json()
        syncResults.push({
          storeId: store.id,
          storeName: store.store_name,
          success: response.ok,
          ...result,
        })
      } catch (error) {
        syncResults.push({
          storeId: store.id,
          storeName: store.store_name,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${stores.length} stores`,
      results: syncResults,
    })
  } catch (error) {
    console.error("Bulk sync error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
