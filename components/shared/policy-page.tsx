export function PolicyPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <p className="eyebrow">WedPlan</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
      <div className="mt-8 space-y-6 leading-relaxed text-foreground/85 [&_h2]:mt-8 [&_h2]:font-sans [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  )
}
