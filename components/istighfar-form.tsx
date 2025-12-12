"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function IstighfarForm() {
  const [name, setName] = useState("")
  const [count, setCount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    // Check if name already exists for today
    const { data: existing } = await supabase
      .from("istighfar_entries")
      .select("id")
      .eq("name", name.trim())
      .eq("entry_date", today)
      .single()

    if (existing) {
      setError("الاسم متكرر")
      setIsLoading(false)
      return
    }

    // Insert new entry
    const { error: insertError } = await supabase.from("istighfar_entries").insert({
      name: name.trim(),
      count: Number.parseInt(count),
      entry_date: today,
    })

    if (insertError) {
      setError("حدث خطأ، حاول مرة أخرى")
      setIsLoading(false)
      return
    }

    setSuccess("تم تسجيل استغفارك بنجاح!")
    setName("")
    setCount("")
    setIsLoading(false)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">تسجيل الاستغفار اليومي</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              type="text"
              placeholder="أدخل اسمك"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">عدد الاستغفار اليوم</Label>
            <Input
              id="count"
              type="number"
              placeholder="مثال: 1000"
              min="1"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري التسجيل..." : "تسجيل"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
