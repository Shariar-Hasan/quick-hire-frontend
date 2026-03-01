import { BaseModel } from "./base.model";
import { JobStatus, JobType, RemoteType } from "./enum";
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

    location?: string | null;

    is_featured: boolean;

    remote_type?: RemoteType | null;

    status: JobStatus;

    expires_at?: Date | null;
    employer?: User | null; // For nested job details when needed
}

export interface JobWithAppliedCount extends Job {
    applications_count: number;
}