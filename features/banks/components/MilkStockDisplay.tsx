"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared";
import { getMilkStock } from "@/features/banks/services/bankStockService";
import type { MilkStock } from "@/features/banks/types/milkStock";
import { Badge } from "@/shared/ui/badge";

interface MilkStockDisplayProps {
  bancoId: string;
}

const MILK_TYPE_LABELS: Record<string, string> = {
  calostro: "Calostro",
  leche_de_transicion: "Leche de Transición",
  leche_madura: "Leche Madura",
};

const STATUS_COLORS: Record<string, string> = {
  suficiente: "bg-green-100 text-green-800",
  critico: "bg-yellow-100 text-yellow-800",
  no_hay: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  suficiente: "Suficiente",
  critico: "Crítico",
  no_hay: "No hay",
};

export function MilkStockDisplay({ bancoId }: MilkStockDisplayProps) {
  const [stock, setStock] = useState<MilkStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStock = async () => {
      try {
        setLoading(true);
        const data = await getMilkStock(bancoId);
        setStock(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando stock");
        console.error("Error loading milk stock:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStock();
  }, [bancoId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🥛 Stock de Leche Materna</CardTitle>
          <CardDescription>Estado actual del inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Cargando stock...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🥛 Stock de Leche Materna</CardTitle>
          <CardDescription>Estado actual del inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🥛 Stock de Leche Materna</CardTitle>
        <CardDescription>Estado actual del inventario</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stock.length > 0 ? (
            stock.map((item) => (
              <div
                key={item.id}
                className="p-3 border rounded-lg flex justify-between items-center hover:shadow-md transition"
              >
                <p className="font-semibold">
                  {MILK_TYPE_LABELS[item.tipo_leche] || item.tipo_leche}
                </p>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${STATUS_COLORS[item.situacion]} cursor-default`}
                  >
                    {STATUS_LABELS[item.situacion]}
                  </Badge>
                  <p className="text-xs text-muted-foreground min-w-fit">
                    {new Date(item.updated_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay datos de stock disponibles
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

