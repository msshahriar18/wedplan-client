"use client"

import { useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { uploadImage } from "@/lib/upload-image"
import { notify } from "@/lib/notify"
import { cn } from "@/lib/utils"

export function MultiImageUpload({
  value,
  onChange,
  max = 6,
  invalid,
  onUploadingChange,
}: {
  value: string[]
  onChange: (urls: string[]) => void
  max?: number
  invalid?: boolean
  onUploadingChange?: (uploading: boolean) => void
}) {
  const [uploading, setUploading] = useState(0)

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (!files.length) return

    const room = max - value.length
    if (files.length > room) {
      notify.info(`You can add ${room} more photo${room === 1 ? "" : "s"}`)
    }
    const selected = files.slice(0, room)

    setUploading(selected.length)
    onUploadingChange?.(true)

    const results = await Promise.allSettled(selected.map((file) => uploadImage(file)))
    const urls: string[] = []
    let failed = 0
    results.forEach((result) => {
      if (result.status === "fulfilled") urls.push(result.value)
      else failed += 1
    })

    if (failed) {
      const reason = results.find((r) => r.status === "rejected") as PromiseRejectedResult
      notify.error(`${failed} photo${failed > 1 ? "s" : ""} failed to upload`, reason?.reason?.message)
    }

    onChange([...value, ...urls])
    setUploading(0)
    onUploadingChange?.(false)
  }

  const remove = (url: string) => onChange(value.filter((item) => item !== url))

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {value.map((url, i) => (
        <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={`Service photo ${i + 1}`} className="size-full object-cover" />
          {i === 0 ? (
            <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              Cover
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => remove(url)}
            aria-label="Remove photo"
            className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}

      {Array.from({ length: uploading }).map((_, i) => (
        <div
          key={`loading-${i}`}
          className="flex aspect-square items-center justify-center rounded-xl border border-dashed bg-muted/60"
        >
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ))}

      {value.length + uploading < max ? (
        <label
          className={cn(
            "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary",
            invalid && "border-destructive/60 text-destructive"
          )}
        >
          <ImagePlus className="size-6" />
          <span className="text-xs font-medium">Add photos</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="sr-only"
            onChange={handleFiles}
            disabled={uploading > 0}
          />
        </label>
      ) : null}
    </div>
  )
}
