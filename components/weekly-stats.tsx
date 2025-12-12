import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ARABIC_DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

type Entry = {
  name: string
  count: number
  entry_date: string
}

export async function WeeklyStats() {
  const supabase = await createClient()

  // Get entries from last 7 days
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 6)

  const { data: entries } = await supabase
    .from("istighfar_entries")
    .select("name, count, entry_date")
    .gte("entry_date", weekAgo.toISOString().split("T")[0])
    .lte("entry_date", today.toISOString().split("T")[0])
    .order("entry_date", { ascending: false })

  if (!entries || entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">إحصائيات الأسبوع</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">لا توجد بيانات بعد</p>
        </CardContent>
      </Card>
    )
  }

  // Group by name
  const grouped: Record<string, Record<string, number>> = {}
  entries.forEach((entry: Entry) => {
    if (!grouped[entry.name]) {
      grouped[entry.name] = {}
    }
    grouped[entry.name][entry.entry_date] = entry.count
  })

  // Generate last 7 days
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split("T")[0])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">إحصائيات الأسبوع</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2 text-right font-semibold">الاسم</th>
                {days.map((date) => {
                  const dayIndex = new Date(date).getDay()
                  return (
                    <th key={date} className="py-3 px-2 text-center font-semibold">
                      {ARABIC_DAYS[dayIndex]}
                    </th>
                  )
                })}
                <th className="py-3 px-2 text-center font-semibold">المجموع</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([name, dateData]) => {
                const total = Object.values(dateData).reduce((sum, c) => sum + c, 0)
                return (
                  <tr key={name} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{name}</td>
                    {days.map((date) => (
                      <td key={date} className="py-3 px-2 text-center text-muted-foreground">
                        {dateData[date] ? dateData[date].toLocaleString("ar-EG") : "-"}
                      </td>
                    ))}
                    <td className="py-3 px-2 text-center font-bold text-primary">{total.toLocaleString("ar-EG")}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
