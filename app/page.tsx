import Link from "next/link";
import { AuthButton } from "@/features/auth";
import { Suspense } from "react";
import { Button } from "@/shared";
import { Droplet, Heart, ShieldAlert } from "lucide-react"; // Importamos iconos clave para el tema médico

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.12),_transparent_35%),_linear-gradient(180deg,_rgb(254_242_242)_0%,_rgb(255_255_255)_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* NAV BAR */}
        <nav className="mb-6 flex items-center justify-between rounded-[2rem] border border-red-100 bg-white/90 px-6 py-4 shadow-[0_18px_50px_rgba(220,38,38,0.05)] backdrop-blur-xl">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-950">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-red-600 text-base font-bold text-white shadow-lg shadow-red-600/30 animate-pulse">
              <Droplet size={20} fill="currentColor" />
            </span>
            <span className="text-lg font-bold tracking-tight">FindADonor</span>
          </div>
          <Suspense>
            <AuthButton />
          </Suspense>
        </nav>

        {/* HERO SECTION */}
        <section className="grid gap-10 rounded-[2.5rem] border border-slate-100 bg-white/95 p-10 shadow-[0_32px_90px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8 flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full bg-red-100 px-4 py-1 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-red-700">
              ❤️ Red de donación de vida
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                Conecta donantes y bancos con <span className="text-red-600">precisión y velocidad</span>.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Maneja inventarios, campañas y perfiles con una interfaz moderna, limpia y diseñada para salvar vidas.
              </p>
            </div>
            
            {/* MINI DETALLES */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-red-500/10 bg-red-50/30 p-5 hover:bg-red-50/60 transition-colors">
                <p className="text-sm font-bold text-red-950 flex items-center gap-2">
                  <Heart size={16} className="text-red-500" fill="currentColor" /> Dashboard centralizado
                </p>
                <p className="mt-2 text-sm text-slate-600">Visualiza datos clave de stock y campañas en un solo lugar.</p>
              </div>
              <div className="rounded-3xl border border-red-500/10 bg-red-50/30 p-5 hover:bg-red-50/60 transition-colors">
                <p className="text-sm font-bold text-red-950 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-red-500" /> Flujo por roles
                </p>
                <p className="mt-2 text-sm text-slate-600">Donante, banco de sangre y banco de leche con experiencias coherentes.</p>
              </div>
            </div>
            
            {/* --- CAMBIO SOLICITADO: BOTONES DEL MISMO TAMAÑO Y BUEN MARGEN --- */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 sm:flex-1 text-center justify-center rounded-2xl shadow-lg shadow-red-600/20 transition-all active:scale-95">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-red-200 hover:border-red-600 hover:bg-red-50 text-red-600 font-bold px-8 py-4 sm:flex-1 text-center justify-center rounded-2xl transition-all active:scale-95">
                <Link href="/sign-up">Registrarse</Link>
              </Button>
            </div>
            {/* ---------------------------------------------------------------- */}
          </div>

          {/* COLUMNA DERECHA: TARJETA DE CONTROL */}
          <div className="grid gap-5">
            {/* --- CAMBIO SOLICITADO: TONO ROJO/BORGOÑA EN LA TARJETA OSCURA --- */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-950 to-red-900 p-8 text-white shadow-2xl shadow-red-950/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.25),_transparent_45%)]" />
              <div className="relative space-y-6">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-red-200">
                  Control inteligente
                </span>
                <h2 className="text-3xl font-bold tracking-tight">Diseñado para decisiones rápidas</h2>
                <p className="text-sm leading-7 text-red-100/80">
                  Una experiencia limpia que ayuda a tu equipo a actuar con seguridad y eficiencia en situaciones de emergencia.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Inventarios</p>
                    <p className="mt-2 text-xl font-bold text-white">Visibilidad total</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Campañas</p>
                    <p className="mt-2 text-xl font-bold text-white">Gestión ágil</p>
                  </div>
                </div>
              </div>
            </div>
            {/* ----------------------------------------------------------------- */}
            
            <div className="rounded-[2rem] border border-red-100 bg-red-50/10 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-800">Ventajas</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">🎯 Interfaz homogénea en toda la aplicación.</li>
                <li className="flex items-center gap-2">⚡ Acceso rápido para donantes y bancos.</li>
                <li className="flex items-center gap-2">📝 Formularios claros y modernos.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <section className="grid gap-6 rounded-[2rem] border border-slate-100 bg-white/95 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] lg:grid-cols-3">
          <div className="lg:col-span-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-bold">Qué puedes hacer</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-100 bg-slate-50/50 p-6 hover:border-red-100 hover:bg-white transition-all">
            <p className="text-sm font-bold text-slate-900">Gestiona tu inventario</p>
            <p className="mt-3 text-sm text-slate-600">Controla niveles de stock y recibe alertas de productos críticos.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-100 bg-slate-50/50 p-6 hover:border-red-100 hover:bg-white transition-all">
            <p className="text-sm font-bold text-slate-900">Crea campañas</p>
            <p className="mt-3 text-sm text-slate-600">Organiza promociones y anuncios para atraer donantes activos.</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-100 bg-slate-50/50 p-6 hover:border-red-100 hover:bg-white transition-all">
            <p className="text-sm font-bold text-slate-900">Configura tu perfil</p>
            <p className="mt-3 text-sm text-slate-600">Personaliza tu cuenta con información útil y una imagen profesional.</p>
          </div>
        </section>

        <footer className="text-center text-sm text-slate-400 py-4">
          Una plataforma médica para donar y coordinar apoyos de forma más rápida.
        </footer>
      </div>
    </main>
  );
}