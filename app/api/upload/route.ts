import { NextResponse } from "next/server"

const MAX_SIZE = 4 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

// uploads go through here so the imgbb key never reaches the browser
export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    return NextResponse.json({ message: "Image upload is not configured" }, { status: 500 })
  }

  let file: FormDataEntryValue | null
  try {
    const formData = await request.formData()
    file = formData.get("image")
  } catch {
    return NextResponse.json({ message: "Invalid upload request" }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No image was selected" }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ message: "Only JPG, PNG, WEBP or GIF images are allowed" }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "Image must be smaller than 4MB" }, { status: 400 })
  }

  const body = new FormData()
  body.append("image", file)

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body,
    })
    const result = await res.json()
    if (!res.ok || !result?.data?.url) {
      return NextResponse.json({ message: "Image hosting rejected the upload" }, { status: 502 })
    }
    return NextResponse.json({ url: result.data.display_url || result.data.url })
  } catch {
    return NextResponse.json({ message: "Could not upload the image, try again" }, { status: 502 })
  }
}
