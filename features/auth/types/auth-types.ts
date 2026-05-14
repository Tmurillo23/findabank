export type UserRole = "donor" | "blood_bank" | "milk_bank";


export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
}


