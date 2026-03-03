import { BaseModel } from "./base.model";
import { Category } from "./category.model";
import { Company } from "./company.model";
import { JobStatus, JobType, RemoteType } from "./enum";
import { Location } from "./location.model";
import { User } from "./user.model";

export interface Job extends BaseModel {
    id: number;
    job_id: string;

    employer_id: number;

    title: string;
    description: string;

    job_type: JobType;

    salary_min?: number | null;
    salary_max?: number | null;
    currency?: string | null;

    location_id?: number | null;
    location?: Location | null;

    is_featured: boolean;

    remote_type?: RemoteType | null;

    status: JobStatus;

    expires_at?: Date | null;
    employer?: User | null;

    company_id?: number | null;
    company?: Company | null;

    category_id?: number | null;
    category?: Category | null;

    tags?: string[];
}

export interface JobWithAppliedCount extends Job {
    applications_count: number;
}