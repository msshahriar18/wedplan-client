"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// the site is designed for a light wedding theme only
function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
