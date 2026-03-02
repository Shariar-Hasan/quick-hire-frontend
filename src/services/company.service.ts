import { Company } from '@/types/models/company.model';
import { ApiResponse, BaseService, PaginatedResponse, ServiceResult } from './base.service';
import { DropDownType } from '@/types/table-types';

class CompanyService extends BaseService {
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
     * Get all companies for dropdown (no pagination, minimal fields)
     */
    async findAllForDropDown(): Promise<ServiceResult<ApiResponse<DropDownType[]>>> {
        return this.get('/dropdown');
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

    /**
     * Get the authenticated employer's own company
     */
    async getMyCompany(): Promise<ServiceResult<ApiResponse<Company>>> {
        return this.get('/me');
    }
}

export const companyService = new CompanyService();
