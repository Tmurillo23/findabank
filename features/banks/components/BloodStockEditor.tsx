"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label } from "@/shared";
import { upsertBloodStock, getBloodStock } from "@/features/banks/services/bankStockService";
import { createClient } from "@/shared/services/supabase/client";
import type { BloodStock } from "@/features/banks/types/bloodStock";
import {BLOOD_TYPES} from "@/features/donors/types";
import { STOCK_SITUATIONS } from "@/features/banks/types";
import {BloodStockEditorProps} from "@/features/banks/types/bloodStock";


export function BloodStockEditor({ bancoId = "", readOnly = false }: BloodStockEditorProps) {
  const [stock, setStock] = useState<BloodStock[]>([]);
  const [selectedType, setSelectedType] = useState<(typeof BLOOD_TYPES)[number]>("O+");
  const [situation, setSituation] = useState<(typeof STOCK_SITUATIONS)[number]>("suficiente");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentBankId, setCurrentBankId] = useState<string>("");

  useEffect(() => {
    const fetchBankIdAndStock = async () => {
      let bankIdToUse = bancoId;

      if (!bankIdToUse) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user?.id) {
          setError("Usuario no autenticado");
          return;
        }

        bankIdToUse = user.id;
      }

      setCurrentBankId(bankIdToUse);

      const data = await getBloodStock(bankIdToUse);
      setStock(data);

      const found = data.find((s) => s.tipo_sangre === "O+");
      setSituation(found?.situacion ?? "suficiente");
    };

    fetchBankIdAndStock();
  }, [bancoId]);

  if (readOnly) {
    // Vista de solo lectura para la página principal
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Sangre</CardTitle>
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
    <>
      {successMessage && (
        <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-3xl border border-green-200 bg-white px-5 py-3 shadow-2xl shadow-slate-950/10">
          <p className="text-sm font-semibold text-green-700">{successMessage}</p>
        </div>
      )}
      <Card>
        <CardHeader>
        <CardTitle>Inventario de Sangre</CardTitle>
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

            setSuccessMessage("Stock de sangre actualizado correctamente");
            setTimeout(() => setSuccessMessage(null), 1500);
            setIsSaving(false);
          }}
          className="w-full mt-6"
          disabled={isSaving}
        >
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </CardContent>
    </Card>
    </>
  );
}
