import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo />
      <p className="mt-12 font-heading text-8xl font-semibold text-primary/20">404</p>
      <h1 className="mt-2 text-3xl font-semibold">This page wandered off</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="h-10 px-5" render={<Link href="/" />} nativeButton={false}>
          Go home
        </Button>
        <Button className="h-10 px-5" render={<Link href="/services" />} nativeButton={false}>
          Browse services
        </Button>
      </div>
    </div>
  )
}
