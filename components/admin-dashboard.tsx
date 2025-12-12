"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Trash2, Pencil, Check, X } from "lucide-react"

const ARABIC_DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

type Entry = {
  id: string
  name: string
  count: number
  entry_date: string
  created_at: string
}

export function AdminDashboard({ entries, userEmail, onDataChange }: { entries: Entry[]; userEmail: string; onDataChange: () => Promise<void> }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const router = useRouter()

  const handleDeleteAll = async () => {
    setIsDeleting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("istighfar_entries")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000")

    if (error) {
      alert("حدث خطأ أثناء الحذف")
      setIsDeleting(false)
      return
    }

    setShowConfirm(false)
    onDataChange()
    setIsDeleting(false)
  }

  const handleLogout = async () => {
    localStorage.removeItem("isAdmin")
    router.push("/")
  }

  const handleDeleteRow = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("istighfar_entries").delete().eq("id", id)

    if (error) {
      alert("حدث خطأ أثناء الحذف")
      return
    }

    onDataChange()
  }

  const handleStartEdit = (id: string, currentCount: number) => {
    setEditingId(id)
    setEditValue(currentCount)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    const supabase = createClient()
    const { error } = await supabase.from("istighfar_entries").update({ count: editValue }).eq("id", editingId)

    if (error) {
      alert("حدث خطأ أثناء التعديل")
      return
    }

    setEditingId(null)
    onDataChange()
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue(0)
  }

  const summary: Record<string, { total: number; days: Record<string, number> }> = {}
  entries.forEach((entry) => {
    if (!summary[entry.name]) {
      summary[entry.name] = { total: 0, days: {} }
    }
    summary[entry.name].total += entry.count
    summary[entry.name].days[entry.entry_date] = entry.count
  })

  const dates = [...new Set(entries.map((e) => e.entry_date))].sort().reverse()

  return (
    <div className="min-h-screen bg-background py-8 px-4" dir="rtl">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">لوحة تحكم المشرف</h1>
            <p className="text-muted-foreground text-sm">{userEmail}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            تسجيل خروج
          </Button>
        </header>

        <div className="grid gap-6">
          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص الإحصائيات</CardTitle>
              <CardDescription>إجمالي {entries.length} تسجيل</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(summary).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">لا توجد بيانات</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 text-right font-semibold">الاسم</th>
                        {dates.slice(0, 7).map((date) => {
                          const dayIndex = new Date(date).getDay()
                          return (
                            <th key={date} className="py-3 px-2 text-center font-semibold">
                              <div>{ARABIC_DAYS[dayIndex]}</div>
                              <div className="text-xs text-muted-foreground">{date}</div>
                            </th>
                          )
                        })}
                        <th className="py-3 px-2 text-center font-semibold">المجموع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summary).map(([name, data]) => (
                        <tr key={name} className="border-b last:border-0">
                          <td className="py-3 px-2 font-medium">{name}</td>
                          {dates.slice(0, 7).map((date) => (
                            <td key={date} className="py-3 px-2 text-center text-muted-foreground">
                              {data.days[date] ? data.days[date].toLocaleString("ar-EG") : "-"}
                            </td>
                          ))}
                          <td className="py-3 px-2 text-center font-bold text-primary">
                            {data.total.toLocaleString("ar-EG")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Entries Table */}
          <Card>
            <CardHeader>
              <CardTitle>جميع التسجيلات</CardTitle>
              <CardDescription>يمكنك تعديل أو حذف أي صف</CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">لا توجد بيانات</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 text-right font-semibold">الاسم</th>
                        <th className="py-3 px-2 text-center font-semibold">التاريخ</th>
                        <th className="py-3 px-2 text-center font-semibold">العدد</th>
                        <th className="py-3 px-2 text-center font-semibold">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries
                        .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
                        .map((entry) => (
                          <tr key={entry.id} className="border-b last:border-0">
                            <td className="py-3 px-2 font-medium">{entry.name}</td>
                            <td className="py-3 px-2 text-center text-muted-foreground">
                              {new Date(entry.entry_date).toLocaleDateString("ar-EG")}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {editingId === entry.id ? (
                                <div className="flex items-center justify-center gap-2">
                                  <Input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(Number.parseInt(e.target.value) || 0)}
                                    className="w-24 text-center"
                                    min="0"
                                  />
                                  <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-primary font-semibold">
                                  {entry.count.toLocaleString("ar-EG")}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleStartEdit(entry.id, entry.count)}
                                  disabled={editingId !== null}
                                >
                                  <Pencil className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeleteRow(entry.id)}
                                  disabled={editingId !== null}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Section */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">حذف جميع البيانات</CardTitle>
              <CardDescription>احذف جميع التسجيلات لبدء أسبوع جديد</CardDescription>
            </CardHeader>
            <CardContent>
              {showConfirm ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDeleteAll} disabled={isDeleting}>
                      {isDeleting ? "جاري الحذف..." : "نعم، احذف الكل"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isDeleting}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="destructive" onClick={() => setShowConfirm(true)}>
                  حذف جميع البيانات
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
