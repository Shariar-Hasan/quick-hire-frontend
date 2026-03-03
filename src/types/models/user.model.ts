import { BaseModel } from "./base.model";
import { Company } from "./company.model";
import { UserRole } from "./enum";
import { Job } from "./job.model";

export interface User extends BaseModel {
    id: number; // auto increment int
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    jobs: Job[]
    companies?: Company[]
}