"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label } from "@/shared";
import { upsertBloodStock, getBloodStock } from "@/features/banks/services/bankStockService";
import { createClient } from "@/shared/services/supabase/client";
import type { BloodStock } from "@/features/banks/types/bloodStock";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const;
const STOCK_SITUATIONS = ["suficiente", "critico", "no_hay"] as const;

interface BloodStockEditorProps {
  bancoId?: string;
  readOnly?: boolean;
}

export function BloodStockEditor({ bancoId = "", readOnly = false }: BloodStockEditorProps) {
  const [stock, setStock] = useState<BloodStock[]>([]);
  const [selectedType, setSelectedType] = useState<(typeof BLOOD_TYPES)[number]>("O+");
  const [situation, setSituation] = useState<"suficiente" | "critico" | "no_hay">("suficiente");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBankId, setCurrentBankId] = useState<string>("");

  useEffect(() => {
    const fetchBankIdAndStock = async () => {
      try {
        let bankIdToUse = bancoId;

        // Si no se pasó bancoId, obtener del usuario autenticado
        if (!bankIdToUse) {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user?.id) {
            setError("Usuario no autenticado");
            return;
          }
          bankIdToUse = user.id;
        }

        console.log('Using bankId:', bankIdToUse);
        setCurrentBankId(bankIdToUse);

        const data = await getBloodStock(bankIdToUse);
        setStock(data);
        const found = data.find((s) => s.tipo_sangre === "O+");
        setSituation(found?.situacion ?? "suficiente");
      } catch (err) {
        console.error("Error loading stock:", err);
        setError("Error cargando stock");
      }
    };

    fetchBankIdAndStock();
  }, [bancoId]);

  if (readOnly) {
    // Vista de solo lectura para la página principal
    return (
      <Card>
        <CardHeader>
          <CardTitle>🩸 Inventario de Sangre</CardTitle>
          <CardDescription>Estado actual del stock de sangre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stock.length === 0 ? (
              <p className="text-muted-foreground">No hay stock registrado</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {stock.map((item) => (
                  <div key={item.tipo_sangre} className="p-3 border rounded">
                    <div className="font-semibold">{item.tipo_sangre}</div>
                    <div className={`text-sm ${
                      item.situacion === 'suficiente' ? 'text-green-600' :
                      item.situacion === 'critico' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.situacion.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Vista de edición para configuración
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
            if (!currentBankId) {
              setError("No se encontró el ID del banco");
              return;
            }

            setIsSaving(true);
            setError(null);

            try {
              const updated = await upsertBloodStock({
                banco_id: currentBankId,
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
