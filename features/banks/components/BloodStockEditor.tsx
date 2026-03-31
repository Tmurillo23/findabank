"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label } from "@/shared";
import { upsertBloodStock, getBloodStock } from "@/features/banks/services/bankStockService";
import type { BloodStock } from "@/features/banks/types/bloodStock";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const;
const STOCK_SITUATIONS = ["suficiente", "critico", "no_hay"] as const;

interface BloodStockEditorProps {
  bancoId?: string;
}

export function BloodStockEditor({ bancoId = "" }: BloodStockEditorProps) {
  const [stock, setStock] = useState<BloodStock[]>([]);
  const [selectedType, setSelectedType] = useState<(typeof BLOOD_TYPES)[number]>("O+");


  const [situation, setSituation] = useState<"suficiente" | "critico" | "no_hay">("suficiente");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bancoId) return;
    getBloodStock(bancoId)
      .then((data) => {
        setStock(data);
        const found = data.find((s) => s.tipo_sangre === "O+");
        setSituation(found?.situacion ?? "suficiente");
      })
      .catch(console.error);
  }, [bancoId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>🩸 Inventario de Sangre</CardTitle>
        <CardDescription>Selecciona tipo de sangre y situacion para actualizar stock</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="blood-type">Tipo de sangre</Label>
            <select
              id="blood-type"
              value={selectedType}
              onChange={(e) => {
                const nextType = e.target.value as (typeof BLOOD_TYPES)[number];
                setSelectedType(nextType);
                const found = stock.find((s) => s.tipo_sangre === nextType);
                setSituation(found?.situacion ?? "suficiente");
              }}
              className="mt-1 w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-900"
            >
              {BLOOD_TYPES.map((bloodType) => (
                <option key={bloodType} value={bloodType}>
                  {bloodType}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="blood-situation">Situacion</Label>
            <select
              id="blood-situation"
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
              const updated = await upsertBloodStock({
                banco_id: bancoId,
                tipo_sangre: selectedType,
                situacion: situation,
              });
              setStock((prev) => {
                const next = [...prev];
                const index = next.findIndex(s => s.tipo_sangre === updated.tipo_sangre);
                if (index > -1) next[index] = updated;
                else next.push(updated);
                return next;
              });
              alert("Stock de sangre actualizado correctamente");
            } catch (err) {
              const message = err instanceof Error ? err.message : "Error desconocido";
              setError(message);
              console.error("Error saving blood stock:", err);
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
