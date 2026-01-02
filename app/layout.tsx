import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Kufi_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const notoKufi = Noto_Kufi_Arabic({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "عداد الاستغفار",
  description: "سجّل استغفارك اليومي",
  generator: "alaa",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoKufi.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
