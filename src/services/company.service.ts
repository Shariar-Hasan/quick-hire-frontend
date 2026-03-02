import { Company } from '@/types/models/company.model';
import { ApiResponse, BaseService, PaginatedResponse, ServiceResult } from './base.service';

export class CompanyService extends BaseService {
    constructor() {
        super('/company');
    }

    /**
     * Get all companies with pagination
     */
    async findAll(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<Company>>>> {
        return this.get('', query);
    }

    /**
     * Get company by ID
     */
    async findOne(id: number): Promise<ServiceResult<ApiResponse<Company>>> {
        return this.get(`/${id}`);
    }

    /**
     * Create a new company
     */
    async create(data: Partial<Company>): Promise<ServiceResult<ApiResponse<Company>>> {
        return this.post('', data);
    }

    /**
     * Update company by ID
     */
    async update(id: number, updateData: Partial<Company>): Promise<ServiceResult<ApiResponse<Company>>> {
        return this.patch(`/${id}`, updateData);
    }

    /**
     * Delete company by ID (soft delete)
     */
    async remove(id: number): Promise<ServiceResult<void>> {
        return this.delete(`/${id}`);
    }
}

export const companyService = new CompanyService();
