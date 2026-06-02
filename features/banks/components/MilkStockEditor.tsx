"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label } from "@/shared";
import { upsertMilkStock, getMilkStock } from "@/features/banks/services/bankStockService";
import { createClient } from "@/shared/services/supabase/client";
import type {MilkStock} from "@/features/banks/types";
import {MilkStockEditorProps,STOCK_SITUATIONS, MILK_TYPES} from "@/features/banks/types";


export function MilkStockEditor({ bancoId = "", readOnly = false }: Readonly<MilkStockEditorProps>) {
  const router = useRouter();
  const [stock, setStock] = useState<MilkStock[]>([]);
  const [milkType, setMilkType] = useState<(typeof MILK_TYPES)[number]>("leche_madura");
  const [situation, setSituation] = useState<"suficiente" | "critico" | "no_hay">("suficiente");
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

      const data = await getMilkStock(bankIdToUse);
      setStock(data);

      const found = data.find((s) => s.tipo_leche === "leche_madura");
      setSituation(found?.situacion ?? "suficiente");
    };

    fetchBankIdAndStock();
  }, [bancoId]);

  return (
    <>
      {successMessage && (
        <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-3xl border border-green-200 bg-white px-5 py-3 shadow-2xl shadow-slate-950/10">
          <p className="text-sm font-semibold text-green-700">{successMessage}</p>
        </div>
      )}
      <Card>
        <CardHeader>
        <CardTitle>Inventario de Leche Materna</CardTitle>
        <CardDescription>
          {readOnly
            ? "Estado actual del stock de leche materna"
            : "Selecciona tipo de leche y situacion para actualizar stock"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {readOnly ? (
          // Modo visualización: mostrar todos los tipos de leche con sus situaciones
          <div className="space-y-4">
            {stock.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay stock registrado aún
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {stock.map((item) => (
                  <div key={item.tipo_leche} className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">
                        {item.tipo_leche.replaceAll('_', " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.situacion === "suficiente"
                            ? "bg-green-100 text-green-800"
                            : item.situacion === "critico"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.situacion.replaceAll('_', " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Última actualización: {new Date(item.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Modo edición: mostrar selectores
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
                disabled={readOnly}
                className="mt-1 w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {MILK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll('_', " ").replace(/\b\w/g, (c) => c.toUpperCase())}
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
                disabled={readOnly}
                className="mt-1 w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {STOCK_SITUATIONS.map((situ) => (
                  <option key={situ} value={situ}>
                    {situ.replaceAll('_', " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        {!readOnly && (
          <Button
            onClick={async () => {
              if (!currentBankId) {
                setError("No se encontró el ID del banco");
                return;
              }

              setIsSaving(true);
              setError(null);

              const updated = await upsertMilkStock({
                banco_id: currentBankId,
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

              setSuccessMessage("Stock de leche actualizado correctamente");
              setTimeout(() => {
                setSuccessMessage(null);
                router.push("/bank");
              }, 700);
              setIsSaving(false);
            }}
            className="w-full mt-6"
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        )}
      </CardContent>
    </Card>
    </>
  );
}
