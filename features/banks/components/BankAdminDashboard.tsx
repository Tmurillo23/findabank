"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
        <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold">
                        {isBloodBank ? `Mi Banco de Sangre ${bank?.nombre}` : `Mi Banco de Leche ${bank?.nombre}`}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Bienvenido a {bank?.nombre}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
                    <Card className="border-blue-100 bg-blue-50">
                        <CardHeader>
                            <CardTitle className="text-base">Total Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{metrics?.total_items_stock ?? 0}</p>
                            <p className="text-sm text-muted-foreground mt-2">Items totales en inventario</p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-100 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-base">Suficiente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-700">{metrics?.items_suficiente ?? 0}</p>
                            <p className="text-sm text-muted-foreground mt-2">Items con stock adecuado</p>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-base">Crítico</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-red-700">{metrics?.items_critico ?? 0}</p>
                            <p className="text-sm text-muted-foreground mt-2">Items que requieren atención</p>
                        </CardContent>
                    </Card>

                    {isMilkBank && (
                        <Card className="border-gray-100 bg-white">
                            <CardHeader>
                                <CardTitle className="text-base">No hay</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-700">{metrics?.items_agotado ?? 0}</p>
                                <p className="text-sm text-muted-foreground mt-2">Items sin stock</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-gray-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-base">Campañas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{metrics?.campanas_activas ?? 0}</p>
                            <p className="text-sm text-muted-foreground mt-2">Campañas activas ahora</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid de contenido */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Stock Display */}
                    <div className="lg:col-span-2">
                        {isBloodBank && <BloodStockEditor readOnly={true} />}
                        {isMilkBank && <MilkStockEditor readOnly={true} />}

                        {/* Estadísticas de Campañas */}
                        <div className="mt-6">
                            {metrics && <CampaignStatistics metrics={metrics} />}
                        </div>
                    </div>

                    {/* Información del Banco */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Banco</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nombre</p>
                                    <p className="font-semibold">{bank?.nombre}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Dirección</p>
                                    <p className="text-sm">{bank?.direccion}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tipo</p>
                                    <p className="font-semibold">
                                        {isBloodBank ? "Banco de Sangre" : "Banco de Leche"}
                                    </p>
                                </div>
                                {bank?.descripcion && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Descripción</p>
                                        <p className="text-sm">{bank.descripcion}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" onClick={() => router.push('/bank/update-profile')}>
                                    Configuración
                                </Button>
                                <Button variant="secondary" className="w-full" onClick={() => router.push('/bank/campaigns')}>
                                    Gestionar Campañas
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Timeline de Actividades */}
                <div className="mb-8">
                    <ActivityTimeline activities={activities} />
                </div>
            </div>
        </div>
    );
}

