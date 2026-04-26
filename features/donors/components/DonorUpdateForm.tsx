// "use client";

// import { useState, useEffect } from "react";
// import { updateDonorProfileInfo } from "@/features/donors/services/donors";
// import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";
// import { useRouter } from "next/navigation";
// import { cn } from "@/shared/services/utils";
// import type { BloodType, DonorProfile } from "@/features/donors/types";

// const BLOOD_TYPES: BloodType[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

// interface DonorUpdateFormProps extends React.ComponentPropsWithoutRef<"div"> {
//   initialData: DonorProfile;
// }

// // Arregrar lo de initial DATA
// export function DonorUpdateForm({ initialData, className, ...props }: DonorUpdateFormProps) {
//   const [fullName, setFullName] = useState(initialData.full_name || "");
//   const [bloodType, setBloodType] = useState<BloodType>(initialData.blood_type || BLOOD_TYPES[0]);
//   const [canDonateMilk, setCanDonateMilk] = useState(initialData.puede_donar_leche || false);
//   const [description, setDescription] = useState(initialData.descripcion || "");
//   const [latitude, setLatitude] = useState(initialData.latitude || 0);
//   const [longitude, setLongitude] = useState(initialData.longitude || 0);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [geoLoading, setGeoLoading] = useState(false);
//   const router = useRouter();

//   // Obtener geolocalización al cargar el componente
//   useEffect(() => {
//     if (initialData.latitude === 0 && initialData.longitude === 0) {
//       getGeolocation();
//     }
//   }, []);
// // Arreglar esto. Llamar a geolocation
//   const getGeolocation = () => {
//     setGeoLoading(true);
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLatitude(position.coords.latitude);
//           setLongitude(position.coords.longitude);
//           setGeoLoading(false);
//         },
//         () => {
//           setError("No se pudo obtener tu ubicación. Por favor, intenta de nuevo.");
//           setGeoLoading(false);
//         }
//       );
//     } else {
//       setError("Geolocalización no disponible en tu navegador");
//       setGeoLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     if (latitude === 0 && longitude === 0) {
//       setError("Por favor, proporciona tu ubicación");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const upsertData: Partial<DonorProfile> = {
//         id: initialData.id,
//         full_name: fullName,
//         blood_type: bloodType,
//         puede_donar_leche: canDonateMilk,
//         descripcion: description,
//         latitude: latitude,
//         longitude: longitude,
//         correo: initialData.correo
//       };

//       await updateDonorProfileInfo(upsertData);

//       alert("Perfil guardado correctamente.");
//       router.push("/donor");
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Error al actualizar perfil");
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle className="text-2xl">👤 Actualiza tu Perfil de Donante</CardTitle>
//             <CardDescription>
//               Mantén tu información actualizada para recibir las mejores recomendaciones.
//             </CardDescription>
//           </div>
//           <button onClick={() => router.push("/donor")} className="text-2xl hover:text-gray-600 dark:hover:text-gray-300">
//             ×
//           </button>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-2">
//                 <Label htmlFor="fullName">Nombre Completo</Label>
//                 <Input
//                   id="fullName"
//                   type="text"
//                   placeholder="Juan Pérez"
//                   required
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="bloodType">Tipo de Sangre</Label>
//                 <select
//                   id="bloodType"
//                   value={bloodType}
//                   onChange={(e) => setBloodType(e.target.value as BloodType)}
//                   className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//                   required
//                 >
//                   {BLOOD_TYPES.map((type) => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   id="canDonateMilk"
//                   checked={canDonateMilk}
//                   onChange={(e) => setCanDonateMilk(e.target.checked)}
//                   className="w-5 h-5 rounded cursor-pointer"
//                 />
//                 <Label htmlFor="canDonateMilk" className="cursor-pointer">
//                   🍼 Puedo donar leche materna
//                 </Label>
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="description">Información Adicional (Opcional)</Label>
//                 <textarea
//                   id="description"
//                   placeholder="Cuéntanos sobre ti, preferencias, horarios disponibles..."
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//                 />
//               </div>

//               {/* Ubicación */}
//               <div className="grid gap-2">
//                 <Label>📍 Ubicación</Label>
//                 <div className="flex gap-2">
//                   <Button
//                     type="button"
//                     onClick={getGeolocation}
//                     disabled={geoLoading || isLoading}
//                     className="w-full"
//                     variant="outline"
//                   >
//                     {geoLoading ? "Obteniendo ubicación..." : latitude && longitude ? "Actualizar Ubicación" : "Obtener Ubicación"}
//                   </Button>
//                 </div>
//                 {latitude && longitude && (
//                   <p className="text-sm text-muted-foreground">
//                     📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
//                   </p>
//                 )}
//               </div>

//               {error && <p className="text-sm text-red-500">{error}</p>}

//               <Button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Guardando..." : "💾 Guardar Perfil"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { updateDonorProfileInfo } from "@/features/donors/services/donors";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/shared";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/services/utils";
import type { BloodType, DonorProfile } from "@/features/donors/types";
import { CheckCircle2 } from "lucide-react"; // Importamos un icono de check

const BLOOD_TYPES: BloodType[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

interface DonorUpdateFormProps extends React.ComponentPropsWithoutRef<"div"> {
  initialData: DonorProfile;
}

export function DonorUpdateForm({ initialData, className, ...props }: DonorUpdateFormProps) {
  const [fullName, setFullName] = useState(initialData.full_name || "");
  const [bloodType, setBloodType] = useState<BloodType>(initialData.blood_type || BLOOD_TYPES[0]);
  const [canDonateMilk, setCanDonateMilk] = useState(initialData.puede_donar_leche || false);
  const [description, setDescription] = useState(initialData.descripcion || "");
  const [latitude, setLatitude] = useState(initialData.latitude || 0);
  const [longitude, setLongitude] = useState(initialData.longitude || 0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  
  // NUEVO: Estado para la confirmación visual de la ubicación
  const [locationUpdated, setLocationUpdated] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
  if (initialData.latitude === 0 && initialData.longitude === 0) {
    getGeolocation();
  }
  // Añadimos las dependencias aquí abajo:
}, [initialData.latitude, initialData.longitude]);

  const getGeolocation = () => {
    setGeoLoading(true);
    setError(null); // Limpiamos errores previos al intentar obtener ubi
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setGeoLoading(false);
          
          // --- NUEVO: Activamos la confirmación visual ---
          setLocationUpdated(true);
          setTimeout(() => setLocationUpdated(false), 2000); 
        },
        () => {
          setError("No se pudo obtener tu ubicación. Por favor, intenta de nuevo.");
          setGeoLoading(false);
        }
      );
    } else {
      setError("Geolocalización no disponible en tu navegador");
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (latitude === 0 && longitude === 0) {
      setError("Por favor, proporciona tu ubicación");
      setIsLoading(false);
      return;
    }

    try {
      const upsertData: Partial<DonorProfile> = {
        id: initialData.id,
        full_name: fullName,
        blood_type: bloodType,
        puede_donar_leche: canDonateMilk,
        descripcion: description,
        latitude: latitude,
        longitude: longitude,
        correo: initialData.correo
      };

      await updateDonorProfileInfo(upsertData);
      router.push("/donor");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">👤 Actualiza tu Perfil de Donante</CardTitle>
            <CardDescription>
              Mantén tu información actualizada para recibir las mejores recomendaciones.
            </CardDescription>
          </div>
          <button onClick={() => router.push("/donor")} className="text-2xl hover:text-gray-600 dark:hover:text-gray-300">
            ×
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Sección Nombre y Sangre igual... */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bloodType">Tipo de Sangre</Label>
                <select
                  id="bloodType"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value as BloodType)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  {BLOOD_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Ubicación CORREGIDA con notificación */}
              <div className="grid gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <Label className="flex items-center gap-2">📍 Ubicación</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={getGeolocation}
                    disabled={geoLoading || isLoading}
                    className={cn(
                      "w-full transition-all duration-300",
                      locationUpdated && "bg-green-600 hover:bg-green-600 text-white border-green-600"
                    )}
                    variant={locationUpdated ? "default" : "outline"}
                  >
                    {geoLoading ? (
                      "Obteniendo ubicación..."
                    ) : locationUpdated ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={18} /> ¡Ubicación Sincronizada!
                      </span>
                    ) : (
                      "Actualizar Ubicación"
                    )}
                  </Button>
                </div>
                {latitude !== 0 && (
                  <p className={cn(
                    "text-xs font-mono text-center mt-1 transition-colors",
                    locationUpdated ? "text-green-600 font-bold" : "text-muted-foreground"
                  )}>
                    Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Checkbox Leche y Descripción igual... */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="canDonateMilk"
                  checked={canDonateMilk}
                  onChange={(e) => setCanDonateMilk(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <Label htmlFor="canDonateMilk" className="cursor-pointer">
                  🥛 Puedo donar leche materna
                </Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Información Adicional (Opcional)</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              {error && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-black font-bold py-6 text-lg shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "💾 Guardar Perfil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}