import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Documentation - ShopifySync",
  description: "Complete API documentation for the ShopifySync platform",
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
