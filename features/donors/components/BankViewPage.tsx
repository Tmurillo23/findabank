"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentLocation, calculateDistance, Coordinates } from "@/shared/services/geolocalization/geolocalization";
import { fetchBankData } from "@/features/banks/services/bankProfileService";
import { BankProfile } from "@/features/banks/types/bank-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { MapPin, ArrowLeft, Loader2, Droplets, Baby, Info } from "lucide-react";

export function BankViewPage({ bankId }: { bankId: string }) {
    const router = useRouter();

    const [bank, setBank] = useState<BankProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadBankData() {
            const data = await fetchBankData(bankId);

            if (!data) {
                setError("Bank data not available");
                setLoading(false);
                return;
            }

            setBank(data);

            const userPos: Coordinates = await getCurrentLocation();
            const bankPos: Coordinates = {
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude)
            };

            if (!isNaN(bankPos.lat) && !isNaN(bankPos.lng)) {
                const d = calculateDistance(userPos, bankPos);
                setDistance(d);
            }

            setLoading(false);
        }

        loadBankData();
    }, [bankId]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-red-500" size={40} />
        </div>
    );

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-center text-red-600 text-lg font-semibold">{error}</p>
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2" size={18} /> Volver
                </Button>
            </div>
        );
    }

    if (!bank) return <p className="text-center p-10">Banco no encontrado.</p>;

    const showMap = distance !== null && distance <= 20;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2" size={18} /> Volver
            </Button>

            <Card className="border-t-4 border-t-red-500 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-bold">{bank.nombre}</CardTitle>
                        <div className="text-slate-500 flex items-center gap-2 mt-1">
                            <MapPin size={16} className="text-red-400" />
                            <span>{bank.direccion || "Dirección no registrada"}</span>
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-full border border-slate-100">
                        {bank.tipo === "blood" ? (
                            <Droplets className="text-red-500" size={32} />
                        ) : (
                            <Baby className="text-blue-400" size={32} />
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                <Info size={18} className="text-primary" /> Información General
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-slate-600 leading-relaxed">
                                    {bank.descripcion || "Este banco de atención ciudadana no ha proporcionado una descripción detallada todavía."}
                                </p>
                            </div>

                            {distance !== null && (
                                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                    <span className="text-sm font-medium text-slate-600">Distancia aproximada:</span>
                                    <span className="text-sm font-bold text-primary">{distance.toFixed(2)} km</span>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-slate-200 h-[300px] bg-slate-50 flex items-center justify-center relative">
                            {showMap ? (
                                <iframe
                                    title="Ubicación del banco"
                                    width="100%"
                                    height="100%"
                                    className="grayscale-[0.3] hover:grayscale-0 transition-all"
                                    loading="lazy"
                                    src={`https://maps.google.com/maps?q=${bank.latitude},${bank.longitude}&z=15&output=embed`}
                                ></iframe>
                            ) : (
                                <div className="text-center p-8 space-y-3">
                                    <div className="bg-white p-4 rounded-full shadow-sm w-fit mx-auto">
                                        <MapPin className="text-slate-300" size={40} />
                                    </div>
                                    <p className="text-slate-500 text-sm font-semibold">
                                        Mapa de proximidad desactivado
                                    </p>
                                    <p className="text-slate-400 text-xs px-4">
                                        La visualización del mapa solo está disponible para bancos a menos de 20km de tu posición.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


