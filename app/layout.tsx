import type { Metadata } from "next"
import { Geist, Playfair_Display } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: {
    default: "WedPlan — Wedding Planning Platform",
    template: "%s | WedPlan",
  },
  description:
    "Find trusted wedding photographers, venues, decorators, caterers and stylists. Compare prices and send booking requests in one place.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", geist.variable, playfair.variable)}
    >
      <body className="min-h-screen">
        <ThemeProvider>
          <Toaster>{children}</Toaster>
        </ThemeProvider>
      </body>
    </html>
  )
}
