import { BaseModel } from "./base.model";
import { Job } from "./job.model";
import { Location } from "./location.model";

export enum CompanySize {
    STARTUP = "STARTUP",         // 1-10
    SMALL = "SMALL",             // 11-50
    MEDIUM = "MEDIUM",           // 51-200
    LARGE = "LARGE",             // 201-1000
    ENTERPRISE = "ENTERPRISE",   // 1000+
}

export interface Company extends BaseModel {
    id: number;
    name: string;
    description?: string | null;
    website?: string | null;
    logo_url?: string | null;
    industry?: string | null;
    size?: CompanySize | null;

    location_id?: number | null;
    location?: Location | null;

    jobs?: Job[];
}
