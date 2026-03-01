import { BaseModel } from "./base.model";
import { ApplicationStatus } from "./enum";
import { Job } from "./job.model";

export interface Application extends BaseModel {
    id: number;
    job_id: number;
    applicant_name: string;
    applicant_email: string;
    resume_url: string;
    cover_letter?: string | null;

    status: ApplicationStatus;

    applied_at: Date;
    job?: Job | null;
}