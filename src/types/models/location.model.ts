import { BaseModel } from "./base.model";

export interface Location extends BaseModel {
    id: number;
    city: string;
    state?: string | null;
    country: string;
    zip_code?: string | null;
}
