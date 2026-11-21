import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const PASSWORD_CHECKS = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
]

export const isStrongPassword = (password: string) =>
  PASSWORD_CHECKS.every((check) => check.test(password))

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="grid gap-1 text-xs sm:grid-cols-3">
      {PASSWORD_CHECKS.map((check) => {
        const passed = check.test(password)
        return (
          <li
            key={check.label}
            className={cn(
              "flex items-center gap-1.5",
              passed ? "text-success" : "text-muted-foreground"
            )}
          >
            {passed ? <Check className="size-3.5" /> : <X className="size-3.5" />}
            {check.label}
          </li>
        )
      })}
    </ul>
  )
}
