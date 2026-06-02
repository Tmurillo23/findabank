import { LoginForm } from "@/features/auth";

// IMPORTANTE: Asegúrate de que diga "export default function Page()"
export default function Page() {
  return (
    <div className="space-y-4 text-slate-900">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-slate-800">Ingresa a tu cuenta</h2>
        <p className="text-xs text-slate-400 mt-1">Gestiona tus donaciones y campañas en tiempo real</p>
      </div>
      
      <LoginForm />
    </div>
  );
}