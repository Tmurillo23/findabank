// import { SignUpForm } from "@/features/auth";

// export default function Page() {
//   return (
//     <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
//       <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
//         <div className="w-full max-w-xl">
//           <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_32px_90px_rgba(15,23,42,0.12)]">
//             <div className="mb-6 text-center">
//               <h2 className="text-2xl font-semibold text-slate-950">Crear cuenta</h2>
//               <p className="mt-2 text-sm text-slate-600">Regístrate para donar o gestionar tu banco desde un solo lugar.</p>
//             </div>
//             <SignUpForm />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { SignUpForm } from "@/features/auth";

export default function Page() {
  return (
    <div className="space-y-5 text-slate-900">
      
      <div className="text-center mb-2">
        <h2 className="text-xl font-black text-slate-900">Crear cuenta</h2>
        <p className="text-xs text-slate-400 mt-1">
          Regístrate para donar o gestionar tu banco desde un solo lugar.
        </p>
      </div>
      
      <SignUpForm />
      
    </div>
  );
}