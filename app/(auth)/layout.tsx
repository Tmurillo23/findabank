// import { Suspense } from "react";

// export default function AuthLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center">
//       <div className="w-full flex flex-col gap-8 items-center">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold">FindaDonor</h1>
//           <p className="text-muted-foreground mt-2">
//             Conectando donantes con bancos de sangre
//           </p>
//         </div>

//         {/* Auth Content */}
//         <Suspense>
//           <div className="w-full max-w-sm">
//             {children}
//           </div>
//         </Suspense>

//         {/* Footer */}
//         <footer className="mt-12 text-center text-xs text-muted-foreground">
//           <p>
//             © 2026 FindaDonor. Powered by{" "}
//             <a
//               href="https://supabase.com"
//               target="_blank"
//               className="hover:underline font-semibold"
//               rel="noreferrer"
//             >
//               Supabase
//             </a>
//           </p>
//         </footer>
//       </div>
//     </main>
//   );
// }

import { Suspense } from "react";
import { Droplet } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-slate-50 to-red-50/50 flex flex-col items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full flex flex-col items-center">
        
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20 animate-pulse">
            <Droplet size={24} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            FindA<span className="text-red-600">Donor</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Conectando donantes con bancos de sangre y leche materna de forma rápida y segura.
          </p>
        </div>

        <Suspense>
          <div className="w-full max-w-md bg-white rounded-[2rem] border border-red-100/80 p-8 shadow-[0_25px_70px_rgba(220,38,38,0.05)]">
            {children}
          </div>
        </Suspense>

        <footer className="mt-8 text-center text-xs text-slate-400">
          <p>
            © 2026 FindADornor. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </main>
  );
}