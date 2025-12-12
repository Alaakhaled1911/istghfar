"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchEntries = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("istighfar_entries")
        .select("*")
        .order("entry_date", { ascending: false })
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching entries:", error)
        setEntries([])
      } else {
        setEntries(data || [])
      }
    } catch (err) {
      console.error("Fetch failed:", err)
      setEntries([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const isAdmin = localStorage.getItem("isAdmin")
    if (!isAdmin) {
      router.push("/login")
      return
    }

    fetchEntries()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    )
  }

  return <AdminDashboard entries={entries} userEmail="admin@istighfar.com" onDataChange={fetchEntries} />
}
