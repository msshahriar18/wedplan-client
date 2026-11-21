export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("image", file)

  const res = await fetch("/api/upload", { method: "POST", body: formData })
  const result = await res.json().catch(() => null)

  if (!res.ok || !result?.url) {
    throw new Error(result?.message || "Image upload failed")
  }
  return result.url
}
