# FindABank

Aplicación web para conectar bancos de sangre y leche materna con donantes.

## ✅ Funcionalidades Completas (Sin Base de Datos)

¡La aplicación ahora funciona completamente **sin necesidad de base de datos externa**!

### 🎯 Lo que funciona:

- ✅ **Autenticación completa** (login/registro con Supabase Auth)
- ✅ **Gestión de perfiles** de bancos y donantes
- ✅ **Inventario de sangre y leche materna**
- ✅ **Campañas de email** (simuladas, sin envío real)
- ✅ **Almacenamiento local** de campañas con localStorage
- ✅ **Envío simulado** de emails con datos de prueba

### 🚀 Cómo usar:

1. **Inicia la aplicación:**
   ```bash
   npm install
   npm run dev
   ```

2. **Regístrate o inicia sesión** como banco de sangre

3. **Ve a "Gestión de Campañas"** y crea tu primera campaña

4. **Elige cómo enviar:**
   - **Por tipo de usuario:** Envía a donantes o bancos registrados
   - **Emails específicos:** Ingresa emails manualmente

5. **¡Los correos se envían realmente!** (usando Resend API)

### 📧 Sistema de Correos:

Los correos **NO son simulados** - se envían realmente usando **Resend API**:

- **Envío real**: Los correos llegan a las bandejas de entrada
- **Límite**: 100 emails gratis por mes
- **Plantillas**: HTML responsive con diseño profesional
- **Batching**: Maneja automáticamente lotes de 100 emails
- **Fallback**: Si no hay usuarios en BD, usa datos de prueba

### Probar envío de correos:

```bash
# Probar que Resend funciona
npm run test-email
```

Asegúrate de cambiar el email de prueba en `test-email.js` por tu email real.

### 💾 Almacenamiento:

- **Campañas:** Funcionan con Supabase (cuando está configurado) o localStorage (como fallback)
- **Persistencia:** Las campañas se mantienen tanto en BD como en navegador
- **Multi-banco:** Cada usuario ve solo sus campañas
- **Tipo de Banco:** Se puede cambiar entre sangre y leche en cualquier momento

### 🔄 Funcionamiento Híbrido:

- **Con BD configurada:** Campañas se guardan en Supabase (persistente entre dispositivos)
- **Sin BD configurada:** Campañas se guardan en localStorage (solo en ese navegador)
- **Transición suave:** Puedes configurar la BD después y las campañas existentes se mantienen

### 🔧 Variables de Entorno Necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL="tu_supabase_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="tu_clave_publica"
RESEND_API_KEY="tu_resend_key_opcional"
```

¡**No necesitas configurar base de datos ni claves de servicio!**
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Proxy
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

  ```env
  NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
  ```
  > [!NOTE]
  > This example uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, which refers to Supabase's new **publishable** key format.
  > Both legacy **anon** keys and new **publishable** keys can be used with this variable name during the transition period. Supabase's dashboard may show `NEXT_PUBLIC_SUPABASE_ANON_KEY`; its value can be used in this example.
  > See the [full announcement](https://github.com/orgs/supabase/discussions/29260) for more information.

  Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
