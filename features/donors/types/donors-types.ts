
export type BloodType = "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";
export const BLOOD_TYPES: BloodType[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export interface DonorProfile {
    id: string;
    full_name: string;
    blood_type: BloodType;
    puede_donar_leche: boolean;
    descripcion?: string;
    created_at: string;
    latitude: number;
    longitude: number;
    correo: string;
}


export interface CreateDonorProfileInput {
    full_name: string;
    blood_type: BloodType;
    puede_donar_leche: boolean;
    descripcion?: string;
    latitude: number;
    longitude: number;
}


export interface UpdateDonorProfileInput {
    full_name?: string;
    blood_type?: BloodType;
    puede_donar_leche?: boolean;
    descripcion?: string;
    latitude?: number;
    longitude?: number;
}

export  interface  DonorData {
    id: string;
    full_name: string;
    blood_type: string;
    puede_donar_leche: boolean;
    description?: string;
    location?: string;
    created_at: string;
}