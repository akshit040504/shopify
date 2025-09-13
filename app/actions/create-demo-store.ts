"use server"

import { createClient } from "@supabase/supabase-js"

export async function createDemoStore(storeName: string, email: string) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    const demoUserEmail = "demo@example.com"

    // Try to get existing demo user first
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", demoUserEmail).single()

    let demoUserId: string

    if (existingUser) {
      demoUserId = existingUser.id
    } else {
      // Create demo user if it doesn't exist
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          email: demoUserEmail,
        })
        .select("id")
        .single()

      if (userError) {
        console.error("Error creating demo user:", userError)
        throw new Error("Failed to create demo user")
      }

      demoUserId = newUser.id
    }

    const timestamp = Date.now()
    const shopDomain = `${storeName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${timestamp}.myshopify.com`

    const { data, error } = await supabase
      .from("stores")
      .insert({
        store_name: storeName,
        shop_domain: shopDomain,
        contact_email: email,
        is_active: true,
        user_id: demoUserId,
      })
      .select()

    if (error) {
      console.error("Database insert error:", error)
      throw new Error("Failed to create demo store")
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error creating demo store:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create demo store",
    }
  }
}
