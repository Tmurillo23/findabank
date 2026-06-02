// import { DonorUpdateForm } from "@/features/donors/components/DonorUpdateForm";

// export default function DonorUpdateProfilePageRoute() {
//   return (
//     <div className="min-h-screen p-4 flex items-start justify-center pt-10">
//       <div className="w-full max-w-2xl">
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <p className="text-sm text-muted-foreground">Editar perfil de donante</p>
//             <h1 className="text-3xl font-bold">Actualizar información</h1>
//           </div>
//         </div>
//         <DonorUpdateForm />
//       </div>
//     </div>
//   );
// }

import { DonorUpdateForm } from "@/features/donors/components/DonorUpdateForm";
import { User } from "lucide-react";
  // import { User, ArrowLeft } from "lucide-react";
  // import Link from "next/link";

export default function DonorUpdateProfilePageRoute() {
  return (
    // Ajustamos el contenedor principal con un fondo limpio y buen espaciado
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-8 md:p-10 flex flex-col items-center justify-start pt-10">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] border border-red-100 p-8 shadow-[0_20px_50px_rgba(220,38,38,0.02)]">
        
        {/* ENCABEZADO DEL FORMULARIO */}
        <div className="mb-8 border-b border-slate-100 pb-6 flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-2xl text-red-600">
            <User size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Configuración del donante</p>
            <h1 className="text-2xl font-black text-slate-900">Actualizar información</h1>
          </div>
        </div>

        {/* --- TRUCO DE FRONTEND DE INTERCEPCIÓN DE ESTILOS ---
          Usamos clases utilitarias aplicadas a los elementos hijos. 
          Cualquier <select> o <textarea> que esté dentro de este div se volverá blanco automáticamente,
          con bordes suaves y letras oscuras.
        */}
        <div className="
          [&_select]:bg-white [&_select]:text-slate-900 [&_select]:border [&_select]:border-slate-200 [&_select]:rounded-xl [&_select]:p-3 [&_select]:w-full [&_select]:h-12 [&_select]:shadow-sm
          [&_textarea]:bg-white [&_textarea]:text-slate-900 [&_textarea]:border [&_textarea]:border-slate-200 [&_textarea]:rounded-xl [&_textarea]:p-3 [&_textarea]:w-full [&_textarea]:shadow-sm
          [&_input]:bg-white [&_input]:text-slate-900 [&_input]:border [&_input]:border-slate-200 [&_input]:rounded-xl [&_input]:h-12 [&_input]:shadow-sm
          [&_label]:text-slate-700 [&_label]:font-bold [&_label]:text-sm
        ">
          <DonorUpdateForm />
        </div>

      </div>
    </div>
  );
}

