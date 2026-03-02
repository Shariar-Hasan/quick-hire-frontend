import { Application } from '@/types/models/application.model';
import { ApiResponse, BaseService, PaginatedResponse, ServiceResult } from './base.service';

export class ApplicationService extends BaseService {
    constructor() {
        super('/application');
    }

    /**
     * Get all applications with pagination
     */
    async findAll(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<Application>>>> {
        return this.get('', query);
    }

    /**
     * Get applications for a specific job
     */
    async findByJob(jobId: number, query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<Application>>>> {
        return this.get(`/job/${jobId}`, query);
    }

    /**
     * Get application by ID
     */
    async findOne(id: number): Promise<ServiceResult<ApiResponse<Application>>> {
        return this.get(`/${id}`);
    }

    /**
     * Submit a new job application
     */
    async create(data: Partial<Application>): Promise<ServiceResult<ApiResponse<Application>>> {
        return this.post('', data);
    }

    /**
     * Update application status (shortlist / reject / hire)
     */
    async updateStatus(id: number, status: Application['status']): Promise<ServiceResult<ApiResponse<Application>>> {
        return this.patch(`/${id}/status`, { status });
    }

    /**
     * Update application by ID
     */
    async update(id: number, updateData: Partial<Application>): Promise<ServiceResult<ApiResponse<Application>>> {
        return this.patch(`/${id}`, updateData);
    }

    /**
     * Delete application by ID
     */
    async remove(id: number): Promise<ServiceResult<void>> {
        return this.delete(`/${id}`);
    }
}

export const applicationService = new ApplicationService();
