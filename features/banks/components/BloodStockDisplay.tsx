"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared";
import { getBloodStock } from "@/features/banks/services/bankStockService";
import type { BloodStock } from "@/features/banks/types/bloodStock";
import { Badge } from "@/shared/ui/badge";

interface BloodStockDisplayProps {
  bancoId: string;
}

const BLOOD_TYPE_LABELS: Record<string, string> = {
  "O+": "O Positivo",
  "O-": "O Negativo",
  "A+": "A Positivo",
  "A-": "A Negativo",
  "B+": "B Positivo",
  "B-": "B Negativo",
  "AB+": "AB Positivo",
  "AB-": "AB Negativo",
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

export function BloodStockDisplay({ bancoId }: BloodStockDisplayProps) {
  const [stock, setStock] = useState<BloodStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStock = async () => {
      try {
        setLoading(true);
        const data = await getBloodStock(bancoId);
        setStock(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando stock");
        console.error("Error loading blood stock:", err);
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
          <CardTitle>🩸 Stock de Sangre</CardTitle>
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
          <CardTitle>🩸 Stock de Sangre</CardTitle>
          <CardDescription>Estado actual del inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Sort blood types in a logical order
  const sortedStock = stock.sort((a, b) => {
    const order = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
    return order.indexOf(a.tipo_sangre) - order.indexOf(b.tipo_sangre);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>🩸 Stock de Sangre</CardTitle>
        <CardDescription>Estado actual del inventario</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sortedStock.length > 0 ? (
            sortedStock.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg hover:shadow-md transition"
              >
                <p className="font-semibold text-lg mb-2">
                  {BLOOD_TYPE_LABELS[item.tipo_sangre] || item.tipo_sangre}
                </p>
                <Badge
                  className={`${STATUS_COLORS[item.situacion]} cursor-default`}
                >
                  {STATUS_LABELS[item.situacion]}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  Actualizado:{" "}
                  {new Date(item.updated_at).toLocaleDateString("es-ES")}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-sm text-muted-foreground">
              No hay datos de stock disponibles
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

