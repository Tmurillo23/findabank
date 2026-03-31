"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label } from "@/shared";
import { upsertMilkStock, getMilkStock } from "@/features/banks/services/bankStockService";
import type { MilkStock } from "@/features/banks/types/milkStock";

const MILK_TYPES = ["calostro", "leche_de_transicion", "leche_madura"] as const;
const STOCK_SITUATIONS = ["suficiente", "critico", "no_hay"] as const;

interface MilkStockEditorProps {
  bancoId?: string;
}

export function MilkStockEditor({ bancoId = "" }: MilkStockEditorProps) {
  const [stock, setStock] = useState<MilkStock[]>([]);
  const [milkType, setMilkType] = useState<(typeof MILK_TYPES)[number]>("leche_madura");
  const [situation, setSituation] = useState<"suficiente" | "critico" | "no_hay">("suficiente");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bancoId) return;
    getMilkStock(bancoId)
      .then((data) => {
        setStock(data);
        const found = data.find((s) => s.tipo_leche === "leche_madura");
        setSituation(found?.situacion ?? "suficiente");
      })
      .catch(console.error);
  }, [bancoId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>🥛 Inventario de Leche Materna</CardTitle>
        <CardDescription>Selecciona tipo de leche y situacion para actualizar stock</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="milk-type">Tipo de leche</Label>
            <select
              id="milk-type"
              value={milkType}
              onChange={(e) => {
                const nextType = e.target.value as (typeof MILK_TYPES)[number];
                setMilkType(nextType);
                const found = stock.find((s) => s.tipo_leche === nextType);
                setSituation(found?.situacion ?? "suficiente");
              }}
              className="mt-1 w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-900"
            >
              {MILK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="milk-situation">Situacion</Label>
            <select
              id="milk-situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value as "suficiente" | "critico" | "no_hay")}
              className="mt-1 w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-900"
            >
              {STOCK_SITUATIONS.map((situ) => (
                <option key={situ} value={situ}>
                  {situ.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <Button
          onClick={async () => {
            if (!bancoId) {
              setError("No se encontró el ID del banco");
              return;
            }

            setIsSaving(true);
            setError(null);

            try {
              const updated = await upsertMilkStock({
                banco_id: bancoId,
                tipo_leche: milkType,
                situacion: situation,
              });
              setStock((prev) => {
                const next = [...prev];
                const index = next.findIndex(s => s.tipo_leche === updated.tipo_leche);
                if (index > -1) next[index] = updated;
                else next.push(updated);
                return next;
              });
              alert("Stock de leche actualizado correctamente");
            } catch (err) {
              const message = err instanceof Error ? err.message : "Error desconocido";
              setError(message);
              console.error("Error saving milk stock:", err);
            } finally {
              setIsSaving(false);
            }
          }}
          className="w-full mt-6"
          disabled={isSaving}
        >
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </CardContent>
    </Card>
  );
}
