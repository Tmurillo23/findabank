#!/usr/bin/env node

/**
 * Script para configurar la base de datos de FindABank
 * Ejecuta: node setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  console.log('🚀 Configurando base de datos de FindABank...\n');

  // Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL no está configurada');
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurada');
    console.log('Obtén la clave desde: https://app.supabase.com/project/_/settings/api');
    process.exit(1);
  }

  // Crear cliente con service role key
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log('📋 Creando tabla campaigns...');

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

    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (tableError) throw new Error(`Error creando tabla: ${tableError.message}`);

    console.log('✅ Tabla campaigns creada');

    console.log('📋 Creando índices...');
    const createIndexSQL = `
      CREATE INDEX IF NOT EXISTS campaigns_banco_id_idx ON public.campaigns(banco_id);
      CREATE INDEX IF NOT EXISTS campaigns_created_at_idx ON public.campaigns(created_at DESC);
    `;

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: createIndexSQL });
    if (indexError) throw new Error(`Error creando índices: ${indexError.message}`);

    console.log('✅ Índices creados');

    console.log('📋 Habilitando Row Level Security...');
    const enableRLS_SQL = `ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;`;

    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLS_SQL });
    if (rlsError) throw new Error(`Error habilitando RLS: ${rlsError.message}`);

    console.log('✅ RLS habilitado');

    console.log('📋 Creando políticas de seguridad...');
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

    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: createPoliciesSQL });
    if (policiesError) throw new Error(`Error creando políticas: ${policiesError.message}`);

    console.log('✅ Políticas de seguridad creadas');

    console.log('📋 Creando función y trigger para updated_at...');
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION public.handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = TIMEZONE('utc'::text, NOW());
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    const { error: functionError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    if (functionError) throw new Error(`Error creando función: ${functionError.message}`);

    const createTriggerSQL = `
      CREATE TRIGGER handle_campaigns_updated_at
          BEFORE UPDATE ON public.campaigns
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_updated_at();
    `;

    const { error: triggerError } = await supabase.rpc('exec_sql', { sql: createTriggerSQL });
    if (triggerError) throw new Error(`Error creando trigger: ${triggerError.message}`);

    console.log('✅ Función y trigger creados');

    console.log('\n🎉 ¡Base de datos configurada exitosamente!');
    console.log('Ahora puedes crear y enviar campañas.');
    console.log('Ve a /bank/campaigns para probar las funcionalidades.');

  } catch (error) {
    console.error('\n❌ Error configurando la base de datos:');
    console.error(error.message);

    if (error.message.includes('function exec_sql')) {
      console.log('\n💡 Sugerencia: Asegúrate de que la SUPABASE_SERVICE_ROLE_KEY sea correcta');
      console.log('O usa la página /setup en la aplicación web');
    }

    process.exit(1);
  }
}

setupDatabase();