"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SelectFilter = {
  name: string
  label: string
  options: { value: string; label: string }[]
}

const ALL = "all"

export function FilterBar({
  placeholder,
  selects = [],
  initial,
}: {
  placeholder: string
  selects?: SelectFilter[]
  initial: Record<string, string | undefined>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, v ?? ""]))
  )

  const apply = (next: Record<string, string>) => {
    const params = new URLSearchParams()
    Object.entries(next).forEach(([key, value]) => {
      if (value.trim() && value !== ALL) params.set(key, value.trim())
    })
    startTransition(() => router.push(params.size ? `${pathname}?${params}` : pathname))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        apply(values)
      }}
      className="mb-5 flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={values.search ?? ""}
          onChange={(e) => setValues({ ...values, search: e.target.value })}
          placeholder={placeholder}
          aria-label="Search"
          className="h-10 pl-9"
        />
      </div>
      {selects.map((select) => {
        const items = [{ value: ALL, label: select.label }, ...select.options]
        return (
          <Select
            key={select.name}
            value={values[select.name] || ALL}
            items={items}
            onValueChange={(value) => {
              const next = { ...values, [select.name]: String(value) === ALL ? "" : String(value) }
              setValues(next)
              apply(next)
            }}
          >
            <SelectTrigger className="h-10 w-full sm:w-44" aria-label={select.label}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      })}
      <Button type="submit" className="h-10 px-5" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : <Search />} Search
      </Button>
    </form>
  )
}
