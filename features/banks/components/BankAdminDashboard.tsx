"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/shared/services/supabase/client";
import { BloodStockEditor, MilkStockEditor, ActivityTimeline, CampaignStatistics } from "@/features/banks/components";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/shared";
import type { ActivityItem, BankData, DashboardMetrics } from "@/features/banks/types";



export function BankAdminDashboard() {
    const router = useRouter();
    const [bank, setBank] = useState<BankData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);

    useEffect(() => {
        const fetchBankDataHandler = async () => {
            const supabase = createClient();

            // Obtener usuario autenticado
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setError("No estás autenticado");
                return;
            }

            // Obtener datos del banco
            const { data, error: dbError } = await supabase
                .from("banco")
                .select("*")
                .eq("id", user.id)
                .single();

            if (dbError || !data) {
                router.push("/bank/setup");
                return;
            }

            setBank(data as BankData);

            // Fetch inicial de métricas y estadísticas
            await fetchDashboardData(user.id);

            setLoading(false);
        };

        fetchBankDataHandler();
    }, [router]);

    const fetchDashboardData = async (bancoId: string) => {
        const supabase = createClient();

        // Métricas del dashboard
        const { data: metricsData } = await supabase
            .from("vw_bank_dashboard_complete")
            .select("*")
            .eq("banco_id", bancoId)
            .single();
        setMetrics((metricsData as DashboardMetrics) || null);

        // Actividades recientes
        const { data: activitiesData } = await supabase
            .from("vw_bank_activity_timeline")
            .select("*")
            .eq("banco_id", bancoId)
            .order("fecha_actividad", { ascending: false })
            .limit(10);
        setActivities((activitiesData as ActivityItem[]) || []);
    };

    useEffect(() => {
        if (!bank) return;

        const supabase = createClient();

        const campaignChannel = supabase
            .channel('campaign_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'campana',
                filter: `banco_id=eq.${bank.id}`
            }, () => {
                fetchDashboardData(bank.id);
            })
            .subscribe();

        const stockChannel = supabase
            .channel('stock_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'stock',
                filter: `banco_id=eq.${bank.id}`
            }, () => {
                fetchDashboardData(bank.id);
            })
            .subscribe();

        return () => {
            campaignChannel.unsubscribe();
            stockChannel.unsubscribe();
        };
    }, [bank]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 py-16 px-4 sm:px-6">
                <div className="mx-auto flex max-w-3xl items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                    <p className="text-lg text-slate-600">Cargando tu banco...</p>
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

    const isMilkBank = bank?.tipo === "leche";
    const isBloodBank = bank?.tipo === "sangre";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            {isBloodBank ? "Banco de Sangre" : "Banco de Leche"}
                        </p>
                        <h1 className="text-5xl font-bold text-slate-900 mb-2">
                            {bank?.nombre}
                        </h1>
                        <p className="text-lg text-slate-600">
                            Gestión centralizada de tu inventario y campañas
                        </p>
                    </div>
                    <Button asChild variant="outline" className="gap-2 sm:self-center">
                        <Link href="/">
                            <ArrowLeft size={18} />
                            Volver al inicio
                        </Link>
                    </Button>
                </div>

                {/* Métricas */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-2 flex-nowrap">
                    <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow flex-shrink-0 w-48">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-600">Total Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-slate-900">{metrics?.total_items_stock ?? 0}</p>
                            <p className="text-xs text-slate-500 mt-2">Items en inventario</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md hover:shadow-lg transition-shadow flex-shrink-0 w-48">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-emerald-700">Suficiente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-emerald-900">{metrics?.items_suficiente ?? 0}</p>
                            <p className="text-xs text-emerald-600 mt-2">Stock adecuado</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-gradient-to-br from-rose-50 to-rose-100 shadow-md hover:shadow-lg transition-shadow flex-shrink-0 w-48">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-rose-700">Crítico</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-rose-900">{metrics?.items_critico ?? 0}</p>
                            <p className="text-xs text-rose-600 mt-2">Requieren atención</p>
                        </CardContent>
                    </Card>

                    {isMilkBank && (
                        <Card className="border-0 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md hover:shadow-lg transition-shadow flex-shrink-0 w-48">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-amber-700">Sin Stock</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-amber-900">{metrics?.items_agotado ?? 0}</p>
                                <p className="text-xs text-amber-600 mt-2">Items agotados</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow flex-shrink-0 w-48">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-blue-700">Campañas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-blue-900">{metrics?.campanas_activas ?? 0}</p>
                            <p className="text-xs text-blue-600 mt-2">Activas ahora</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sección Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-10">
                    {/* Stock Display */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Inventario */}
                        <div className="bg-white rounded-xl shadow-md border-0 overflow-hidden">
                            {isBloodBank && <BloodStockEditor readOnly={true} />}
                            {isMilkBank && <MilkStockEditor readOnly={true} />}
                        </div>

                        {/* Estadísticas de Campañas */}
                        {metrics && (
                            <div className="bg-white rounded-xl shadow-md border-0 overflow-hidden p-6">
                                <CampaignStatistics metrics={metrics} />
                            </div>
                        )}
                    </div>

                    {/* Información del Banco */}
                    <Card className="lg:col-span-1 border-0 shadow-md h-fit">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-slate-900">Detalles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Nombre</p>
                                <p className="text-base font-medium text-slate-900 mt-2">{bank?.nombre}</p>
                            </div>
                            <div className="pt-3 border-t border-slate-200">
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Tipo</p>
                                <p className="text-base font-medium text-slate-900 mt-2">
                                    {isBloodBank ? "🩸 Banco de Sangre" : "🥛 Banco de Leche"}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-slate-200">
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Dirección</p>
                                <p className="text-base text-slate-700 mt-2">{bank?.direccion}</p>
                            </div>
                            {bank?.descripcion && (
                                <div className="pt-3 border-t border-slate-200">
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Descripción</p>
                                    <p className="text-base text-slate-700 mt-2">{bank.descripcion}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Acciones Rápidas */}
                    <Card className="lg:col-span-1 border-0 shadow-md bg-gradient-to-br from-slate-50 to-slate-100 h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">Acciones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-col items-center gap-3">
                                <Button 
                                    className="w-48 px-6 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors" 
                                    onClick={() => router.push('/bank/update-profile')}
                                >
                                    Configuración
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    className="w-48 px-6 py-2 font-semibold" 
                                    onClick={() => router.push('/bank/campaigns')}
                                >
                                    Gestionar Campañas
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white rounded-xl shadow-md border-0 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Actividad Reciente</h2>
                    <ActivityTimeline activities={activities} />
                </div>
            </div>
        </div>
    );
}

