import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const initials = (name?: string | null) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

export function UserAvatar({
  src,
  name,
  className,
}: {
  src?: string | null
  name?: string | null
  className?: string
}) {
  return (
    <Avatar className={cn("size-9", className)}>
      {src ? <AvatarImage src={src} alt={name || "User"} /> : null}
      <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
