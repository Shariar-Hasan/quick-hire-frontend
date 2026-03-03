import { BaseModel } from "./base.model";

export interface Category extends BaseModel {
    id: number;
    name: string;
    description?: string | null;
    slug: string;
    logo_url?: string | null;
    is_featured?: boolean;
}
