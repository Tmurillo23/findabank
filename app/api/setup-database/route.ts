import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Este endpoint requiere la service role key para crear tablas
export async function POST(request: NextRequest) {
  try {
    // Verificar que tenemos la service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json(
        {
          error: 'SUPABASE_SERVICE_ROLE_KEY no está configurada',
          message: 'Para crear tablas, necesitas agregar SUPABASE_SERVICE_ROLE_KEY a tus variables de entorno'
        },
        { status: 500 }
      );
    }

    // Crear cliente con service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    // SQL para crear la tabla campaigns
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.campaigns (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          banco_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          nombre TEXT NOT NULL,
          descripcion TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );
    `;

    const createIndexSQL = `
      CREATE INDEX IF NOT EXISTS campaigns_banco_id_idx ON public.campaigns(banco_id);
      CREATE INDEX IF NOT EXISTS campaigns_created_at_idx ON public.campaigns(created_at DESC);
    `;

    const enableRLS_SQL = `
      ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
    `;

    const createPoliciesSQL = `
      CREATE POLICY "Users can view their own campaigns" ON public.campaigns
          FOR SELECT USING (auth.uid() = banco_id);

      CREATE POLICY "Users can create their own campaigns" ON public.campaigns
          FOR INSERT WITH CHECK (auth.uid() = banco_id);

      CREATE POLICY "Users can update their own campaigns" ON public.campaigns
          FOR UPDATE USING (auth.uid() = banco_id);

      CREATE POLICY "Users can delete their own campaigns" ON public.campaigns
          FOR DELETE USING (auth.uid() = banco_id);
    `;

    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION public.handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = TIMEZONE('utc'::text, NOW());
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    const createTriggerSQL = `
      CREATE TRIGGER handle_campaigns_updated_at
          BEFORE UPDATE ON public.campaigns
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_updated_at();
    `;

    // Ejecutar todos los SQL en orden
    const queries = [
      createTableSQL,
      createIndexSQL,
      enableRLS_SQL,
      createPoliciesSQL,
      createFunctionSQL,
      createTriggerSQL
    ];

    for (const query of queries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });

      if (error) {
        console.error('Error ejecutando query:', query, error);
        return NextResponse.json(
          {
            error: 'Error ejecutando SQL',
            details: error.message,
            query: query.substring(0, 100) + '...'
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Base de datos configurada correctamente',
      tables_created: ['campaigns'],
      features_enabled: ['RLS', 'Policies', 'Triggers', 'Indexes']
    });

  } catch (error) {
    console.error('Error en setup-database:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}