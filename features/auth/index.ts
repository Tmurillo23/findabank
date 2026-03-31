// Componentes de autenticación
export { LoginForm, SignUpForm, LogoutButton, AuthButton } from './components';

// Tipos de autenticación
export type { UserProfile, UserRole } from './types';

// Tipos de donantes
export type { DonorProfile, CreateDonorProfileInput } from '@/features/donors/types';

// Tipos de bancos
export type { BankProfile, BankType, CreateBankProfileInput, Location } from '@/features/banks/types';

// Tipos de stock
export type { BloodStock } from '@/features/banks/types/bloodStock';
export type { MilkStock } from '@/features/banks/types/milkStock';

// Servicios cliente y server actions
export { signInWithPassword, signUpWithEmail, getUserRole, redirectByRole, getAuthenticatedUser, createDonorProfile, createBankProfile } from './services';

