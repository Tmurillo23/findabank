# Arquitectura y responsabilidades — FindADonor

Este documento resume las funciones y responsabilidades de los módulos y servicios más importantes del proyecto. Está pensado para ayudar a nuevos desarrolladores a entender qué hace cada función, sus entradas, salidas y efectos secundarios.

## app

- **app/layout.tsx**
  - `metadata`: metadatos globales (base URL, título, descripción).
  - `RootLayout(children)`: layout raíz que aplica la fuente global y envuelve la app con `ThemeProvider`.

- **app/page.tsx**
  - `Home`: página principal que compone el hero, navegación y tarjetas informativas. Integra `AuthButton` y botones de navegación.

## Shared: utilidades y Supabase

- **shared/services/supabase/client.ts**
  - `createClient()`: crea y retorna el cliente de Supabase para uso en el navegador (cliente/browser). Usa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

- **shared/services/supabase/server.ts**
  - `createClient()`: crea un cliente supabase para Server Components / server-side, con manejo de cookies (getAll / setAll) para mantener sesiones.

- **shared/hooks/useAuth.ts**
  - `useAuth()`: hook que retorna `{ user, loading }`. Obtiene el usuario actual con `supabase.auth.getUser()` y subscribe a `onAuthStateChange` para mantener el estado actualizado.

- **shared/services/utils.ts**
  - `cn(...inputs)`: helper para combinar clases (`clsx` + `twMerge`).
  - `hasEnvVars`: booleano que indica si las envs públicas de Supabase están definidas.

## Manejo de errores

- **shared/services/errors/errorMapper.ts**
  - `mapSupabaseError(error)`: mapea errores crudos de Supabase a instancias específicas de `AppError` (AuthenticationError, AuthorizationError, ValidationError, DatabaseError, SupabaseError) o `null` cuando corresponde a 'not found'.
  - `mapSignUpError(error)`: mapea errores específicos de sign-up (email duplicado, email inválido) a `SignUpError`, delegando a `mapSupabaseError` cuando aplica.
  - `normalizeError(error)`: normaliza cualquier `unknown` a `AppError`, con heurísticas para errores de Supabase y mensajes comunes.
  - Varias guards: `isRetryableError`, `isAuthenticationError`, `isAuthorizationError`, `isNotFoundError`, `isSignUpError`.

## Auth (servicios)

- **features/auth/services/loginClient.ts**
  - `signInWithPassword(email, password)`: realiza `supabase.auth.signInWithPassword`, mapea errores y devuelve la respuesta (session/user).
  - `getUserRole()`: obtiene `user.user_metadata.role` del usuario autenticado.

- **features/auth/services/signupClient.ts**
  - `signUpWithEmail(email, password, role)`: registra un usuario con `supabase.auth.signUp`, agrega el `role` a `options.data` y configura `emailRedirectTo` para confirmación. Lanza errores mapeados o retorna el usuario creado.

## Bancos (servicios y componentes)

- **features/banks/services/bankProfileService.ts**
  - `fetchBankData(bankId)`: consulta la tabla `banco` por `id` y retorna `BankProfile | null`. Usa `mapSupabaseError` y puede devolver `null` en casos 404.
  - `updateBankProfileInfo(bankId, updates)`: valida `bankId`, intenta `update` y si no existe hace `insert`. Lanza `ValidationError` si faltan datos.

- **features/banks/services/bankStockService.ts**
  - `getBloodStock(bancoId)`, `getMilkStock(bancoId)`: retornan arrays de stock filtrados por banco y tipo (excluyen valores null).
  - `upsertBloodStock(input)`, `upsertMilkStock(input)`: comportamiento upsert; si existe actualiza `situacion` y `updated_at`, si no existe inserta la fila y retorna la fila resultante.

- **features/banks/components/BankAdminDashboard.tsx**
  - `BankAdminDashboard` (Client Component): controla la vista administrativa del banco. Principales responsabilidades:
    - Obtener usuario y datos del banco (verificar existencia y redirigir a setup si no existe).
    - `fetchDashboardData(bancoId)`: obtiene métricas desde `vw_bank_dashboard_complete` y actividades desde `vw_bank_activity_timeline`.
    - Suscribirse a canales realtime (`campana` y `stock`) y refrescar métricas automáticamente.
    - Renderizar métricas, editor de stock (solo lectura en este flujo), panel de detalles y acciones, y timeline de actividades.

## Campañas

- **features/campaigns/services/campaign-creation.ts**
  - `createCampaign(campaignData)`: inserta una campaña en la tabla `campana` y retorna la fila creada.
  - `getBankCampaigns(bancoId)`: consulta campañas de un banco ordenadas por `created_at` desc.

## Errores y tipos comunes

- Carpeta `features/AppErrors` contiene clases de error extendiendo `AppError` (ValidationError, AuthenticationError, SupabaseError, etc.), usadas por el mapeador de errores para devolver errores tipados y con contexto.

## Notas y recomendaciones

- Todos los servicios que llaman a Supabase usan `createClient()` (browser) o `createServerClient()` (server) según contexto. Evitar mantener clientes en globals en server.
- El mapeador de errores centraliza la lógica para convertir errores crudos en errores de aplicación con metadata y severidad.
- Para cambios futuros, agregar ejemplos de petición/respuesta en cada servicio facilitará las pruebas y la documentación API.

---

Si quieres, puedo:
- Añadir ejemplos de uso (snippets) para cada función.
- Generar un archivo `docs/USAGE.md` con comandos y ejemplos para testing local.

Archivo creado automáticamente desde la revisión de código.
