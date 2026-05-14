
export interface Campaign {
    id: string;
    banco_id: string;
    nombre: string;
    descripcion?: string;
    ubicacion: string;
    fecha: string; // YYYY-MM-DD
    created_at: string;
}


export interface CreateCampaignInput {
    banco_id: string;
    nombre: string;
    descripcion?: string;
    ubicacion: string;
    fecha: string; //  FORMATO YYYY-MM-DD
}


export interface CampaignFormProps {
    bankId: string;
    onCampaignCreated: (campaign: Campaign) => void;
}
