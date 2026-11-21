import Image from "next/image"
import { Logo } from "@/components/shared/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80"
          alt="Bride and groom holding hands"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2b1018]/85 via-[#2b1018]/30 to-transparent" />
        <div className="absolute inset-x-10 bottom-12 text-white">
          <p className="font-heading text-3xl leading-snug">
            &ldquo;Every vendor we needed, <span className="text-gold italic">in one place.</span>&rdquo;
          </p>
          <p className="mt-3 text-sm text-white/70">
            Plan the day, not the paperwork. Compare vendors and track every request from your
            dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
