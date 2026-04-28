import Link from "next/link";
import { AuthButton } from "@/features/auth";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-50 text-slate-950">
      <div className="flex-1 w-full flex flex-col gap-12 items-center py-8">
        <nav className="w-full max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm shadow-slate-200/50 px-6 py-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 font-semibold text-slate-900">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500 text-sm font-bold text-white shadow-sm shadow-red-500/20">
              FD
            </span>
            <Link href="/">FindaDonor</Link>
          </div>

          <Suspense>
            <AuthButton />
          </Suspense>
        </nav>

        <div className="w-full max-w-5xl px-5">
          <section className="rounded-[2rem] bg-gradient-to-br from-rose-50 via-white to-red-50 p-10 shadow-xl shadow-rose-200/40">
            <div className="space-y-6">
              <p className="rounded-full bg-red-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.22em] text-red-700 w-max">
                Red de donación
              </p>
              <h1 className="text-5xl font-bold leading-tight text-slate-950">
                Conecta con bancos de sangre y leche rápidamente.
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                Administra tu perfil, revisa inventarios y ayuda a más personas desde un solo lugar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </section>
        </div>

        <footer className="w-full max-w-5xl mx-auto text-center text-xs text-slate-500 py-8">
          <p>Una plataforma para donar y coordinar apoyos de forma más rápida.</p>
        </footer>
      </div>
    </main>
  );
}
