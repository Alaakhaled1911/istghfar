import { IstighfarForm } from "@/components/istighfar-form"
import { WeeklyStats } from "@/components/weekly-stats"
import { Marquee } from "@/components/marquee"

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-12 px-4" dir="rtl">
      <div className="mx-auto max-w-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">عداد الاستغفار</h1>
          <p className="text-muted-foreground">سجّل استغفارك اليومي</p>
        </header>

        <Marquee />

        <IstighfarForm />

        <div className="mt-12">
          <WeeklyStats />
        </div>
      </div>
    </main>
  )
}
