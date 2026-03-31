import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full flex flex-col gap-8 items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">FindaDonor</h1>
          <p className="text-muted-foreground mt-2">
            Conectando donantes con bancos de sangre
          </p>
        </div>

        {/* Auth Content */}
        <Suspense>
          <div className="w-full max-w-sm">
            {children}
          </div>
        </Suspense>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>
            © 2026 FindaDonor. Powered by{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              className="hover:underline font-semibold"
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

