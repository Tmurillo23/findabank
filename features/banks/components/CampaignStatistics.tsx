"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {CampaignStatisticsProps} from "@/features/campaigns/types";


export function CampaignStatistics({ metrics }: Readonly<CampaignStatisticsProps>) {
  const total = metrics.total_campanas ?? 0;
  const active = metrics.campanas_activas ?? 0;

  const chartData = [
    { name: "Total", value: total },
    { name: "Activas", value: active },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Campañas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Campañas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{active}</p>
            <p className="text-xs text-muted-foreground">Campañas Activas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}