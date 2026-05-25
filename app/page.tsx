import Link from "next/link";
import { AuthButton } from "@/features/auth";
import { Suspense } from "react";
import { Button } from "@/shared";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_26%),_linear-gradient(180deg,_rgb(248_250_252)_0%,_rgb(255_255_255)_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center justify-between rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-950">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-950 text-base font-bold text-white shadow-lg shadow-slate-950/20">
              FD
            </span>
            <span>FindABank</span>
          </div>
          <Suspense>
            <AuthButton />
          </Suspense>
        </nav>

        <section className="grid gap-10 rounded-[2.5rem] border border-slate-200 bg-white/95 p-10 shadow-[0_32px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-sky-700">
              Red de donación
            </span>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Conecta donantes y bancos con precisión y velocidad.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Maneja inventarios, campañas y perfiles con una interfaz moderna, limpia y fácil de usar.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-950">Dashboard centralizado</p>
                <p className="mt-2 text-sm text-slate-600">Visualiza datos clave de stock y campañas en un solo lugar.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-950">Flujo por roles</p>
                <p className="mt-2 text-sm text-slate-600">Donante, banco de sangre y banco de leche con experiencias coherentes.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-up">Registrarse</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/15">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),_transparent_40%)]" />
              <div className="relative space-y-4">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
                  Control inteligente
                </span>
                <h2 className="text-3xl font-semibold">Diseñado para decisiones rápidas</h2>
                <p className="text-sm leading-7 text-slate-300">
                  Una experiencia limpia que ayuda a tu equipo a actuar con seguridad y eficiencia.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Inventarios</p>
                    <p className="mt-2 text-xl font-semibold">Visibilidad total</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Campañas</p>
                    <p className="mt-2 text-xl font-semibold">Gestión ágil</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Ventajas</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Interfaz homogénea en toda la aplicación.</li>
                <li>• Acceso rápido para donantes y bancos.</li>
                <li>• Formularios claros y modernos.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_32px_90px_rgba(15,23,42,0.12)] lg:grid-cols-3">
          <div className="lg:col-span-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Qué puedes hacer</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">Gestiona tu inventario</p>
            <p className="mt-3 text-sm text-slate-600">Controla niveles de stock y recibe alertas de productos críticos.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">Crea campañas</p>
            <p className="mt-3 text-sm text-slate-600">Organiza promociones y anuncios para atraer donantes activos.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">Configura tu perfil</p>
            <p className="mt-3 text-sm text-slate-600">Personaliza tu cuenta con información útil y una imagen profesional.</p>
          </div>
        </section>

        <footer className="text-center text-sm text-slate-500">
          Una plataforma para donar y coordinar apoyos de forma más rápida.
        </footer>
      </div>
    </main>
  );
}
