import Link from "next/link";
import { AuthButton } from "@/features/auth";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* Navbar */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>FindaDonor</Link>
            </div>

            {/* Auth Buttons */}
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">
          <section className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-bold text-4xl mb-4">Bienvenido a FindaDonor</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Conecta con bancos de sangre y leche de tu área.
              Dona vida con un solo clic.
            </p>

            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-3 bg-foreground text-background rounded-lg font-semibold hover:opacity-90 transition"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-3 border border-foreground rounded-lg font-semibold hover:bg-foreground/10 transition"
              >
                Registrarse
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
