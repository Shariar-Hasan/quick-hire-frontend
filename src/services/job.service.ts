import { Job, JobWithAppliedCount } from '@/types/models/job.model';
import { Application } from '@/types/models/application.model';
import { ApiResponse, BaseService, PaginatedResponse, ServiceResult } from './base.service';

export interface DashboardAnalytics {
    jobs: { total: number; published: number; draft: number; closed: number };
    applications: { total: number; applied: number; shortlisted: number; rejected: number; hired: number };
    recentApplications: (Application & { job: Pick<Job, 'id' | 'title' | 'job_id' | 'job_type'> | null })[];
    topJobs: { id: number; title: string; job_id: string; status: string; company: { name: string } | null; applications_count: number }[];
}

class JobService extends BaseService {
    constructor() {
        super('/job');
    }

    /**
     * Get all jobs with pagination
     */
    async findAll(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<Job>>>> {
        return this.get('', query);
    }

    /**
     * Get all jobs with application count (employer/admin use)
     */
    async findAllWithAppliedCount(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<JobWithAppliedCount>>>> {
        return this.get('/with-count', query);
    }

    /**
     * Get job by ID
     */
    async findOne(id: number): Promise<ServiceResult<ApiResponse<Job>>> {
        return this.get(`/${id}`);
    }

    /**
     * Get job by job_id (public slug)
     */
    async findByJobId(jobId: string): Promise<ServiceResult<ApiResponse<Job>>> {
        return this.get(`/slug/${jobId}`);
    }

    /**
     * Create a new job
     */
    async create(data: Partial<Job>): Promise<ServiceResult<ApiResponse<Job>>> {
        return this.post('', data);
    }

    /**
     * Update job by ID
     */
    async update(id: number, updateData: Partial<Job>): Promise<ServiceResult<ApiResponse<Job>>> {
        return this.patch(`/${id}`, updateData);
    }

    /**
     * Delete job by ID (soft delete)
     */
    async remove(id: number): Promise<ServiceResult<void>> {
        return this.delete(`/${id}`);
    }

    /**
     * Get dashboard analytics (admin/employer)
     */
    async getAnalytics(): Promise<ServiceResult<ApiResponse<DashboardAnalytics>>> {
        return this.get('/analytics');
    }
}

export const jobService = new JobService();
