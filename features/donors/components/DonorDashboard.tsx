"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/services/supabase/client";
import { fetchDonorData } from "@/features/donors/services/donors";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/shared";
import {DonorData} from "@/features/donors/types";


export function DonorDashboard() {
    const router = useRouter();
    const [donor, setDonor] = useState<DonorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isProfileComplete = Boolean(donor?.full_name && donor?.blood_type);

    useEffect(() => {
        const fetchDonorDataHandler = async () => {
            const supabase = createClient();

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setError("No estás autenticado");
                return;
            }

            const data = await fetchDonorData(user.id);

            if (!data) {
                setError("No se encontraron datos del donante");
                return;
            }

            setDonor(data);
            setLoading(false);
        };

        fetchDonorDataHandler();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 py-16 px-4 sm:px-6">
                <div className="mx-auto flex max-w-3xl items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                    <p className="text-lg text-slate-600">Cargando tu perfil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 py-16 px-4 sm:px-6">
                <div className="mx-auto flex max-w-3xl items-center justify-center rounded-[2rem] border border-rose-100 bg-rose-50 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                    <p className="text-lg text-rose-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 max-w-3xl">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-950">Mi Perfil de Donante</h1>
                    <p className="mt-2 text-slate-600">Bienvenido, {donor?.full_name}</p>
                </div>

                {!isProfileComplete && (
                    <div className="rounded-[2rem] border border-orange-200 bg-orange-50 p-5 mb-8 text-orange-900 shadow-sm">
                        <p className="font-semibold">Tu perfil está incompleto</p>
                        <p className="text-sm mt-1">
                            Completa tu información para recibir campañas más adecuadas y mejorar tus oportunidades de donación.
                        </p>
                    </div>
                )}

                <div
                    className="mb-10 gap-4"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'stretch' }}
                >
                    <Card className="rounded-[2rem] border border-blue-100 bg-blue-50/90 min-h-[170px]">
                        <CardHeader>
                            <CardTitle className="text-base">Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-6">
                            <p className="text-3xl font-bold text-slate-950">{isProfileComplete ? 'Completo' : 'Incompleto'}</p>
                            <p className="text-sm text-slate-600 mt-2">Actualiza tu información</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[2rem] border border-emerald-100 bg-emerald-50/90 min-h-[170px]">
                        <CardHeader>
                            <CardTitle className="text-base">Sangre</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-6">
                            <p className="text-3xl font-bold text-slate-950">{donor?.blood_type || '-'}</p>
                            <p className="text-sm text-slate-600 mt-2">Tipo de sangre registrado</p>
                        </CardContent>
                    </Card>
                    <Card className={`rounded-[2rem] border ${donor?.puede_donar_leche ? 'border-emerald-100 bg-emerald-50/90' : 'border-slate-200 bg-slate-50/90'} min-h-[170px]`}>
                        <CardHeader>
                            <CardTitle className="text-base">Leche</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-6">
                            <p className="text-3xl font-bold text-slate-950">{donor?.puede_donar_leche ? 'Sí' : 'No'}</p>
                            <p className="text-sm text-slate-600 mt-2">Donación de leche</p>
                        </CardContent>
                    </Card>
                </div>

                <div
                    className="mb-10 gap-6"
                    style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}
                >
                    <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 py-6">
                            <div>
                                <p className="text-sm text-slate-500">Nombre Completo</p>
                                <p className="text-lg font-semibold text-slate-950">{donor?.full_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Tipo de Sangre</p>
                                <p className="text-lg font-semibold text-slate-950">{donor?.blood_type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Puedo donar leche materna?</p>
                                <p className="text-lg font-semibold text-slate-950">{donor?.puede_donar_leche ? 'Sí' : 'No'}</p>
                            </div>
                            {donor?.description && (
                                <div>
                                    <p className="text-sm text-slate-500">Descripción</p>
                                    <p className="text-base text-slate-900">{donor.description}</p>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full border-slate-200 text-slate-950 hover:bg-slate-100"
                                onClick={() => router.push('/donor/update-profile')}
                            >
                                Editar Perfil
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 py-6">
                            <button
                                type="button"
                                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                                className="w-full rounded-full px-4 py-3 text-sm font-semibold shadow-md transition focus:outline-none"
                                onClick={() => router.push('/donor/update-profile')}
                            >
                                Editar Perfil
                            </button>
                            <button
                                type="button"
                                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                                className="w-full rounded-full px-4 py-3 text-sm font-semibold shadow-md transition focus:outline-none"
                                onClick={() => router.push('/donor/nearby-banks')}
                            >
                                Buscar Bancos
                            </button>
                            <button
                                type="button"
                                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                                className="w-full rounded-full px-4 py-3 text-sm font-semibold shadow-md transition focus:outline-none"
                                onClick={() => router.push('/')}
                            >
                                Volver al Inicio
                            </button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Estado de Donación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-[2rem] border border-red-200 bg-red-50 p-5">
                                <p className="text-sm font-semibold text-red-700">Donación de Sangre</p>
                                <p className="text-xs text-red-600 mt-2">Tipo: <span className="font-semibold">{donor?.blood_type}</span></p>
                                <p className="text-xs text-red-600 mt-3">
                                    Cuéntale a los bancos dónde estás y recibirás notificaciones cuando necesiten tu sangre.
                                </p>
                            </div>
                            <div className={`rounded-[2rem] border p-5 ${donor?.puede_donar_leche ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                                <p className={`text-sm font-semibold ${donor?.puede_donar_leche ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {donor?.puede_donar_leche ? 'Donación de Leche' : 'No Puede Donar Leche'}
                                </p>
                                <p className={`text-xs mt-2 ${donor?.puede_donar_leche ? 'text-blue-600' : 'text-slate-600'}`}>
                                    {donor?.puede_donar_leche
                                        ? 'Disponible para donar leche materna'
                                        : 'No disponible para donar leche materna'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

