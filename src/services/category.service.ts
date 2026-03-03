import { Category } from '@/types/models/category.model';
import { ApiResponse, BaseService, PaginatedResponse, ServiceResult } from './base.service';
import { DropDownType } from '@/types/table-types';

class CategoryService extends BaseService {
    constructor() {
        super('/category');
    }

    /**
     * Get all categories with pagination
     */
    async findAll(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<Category>>>> {
        return this.get('', query);
    }

    /**
     * Get all categories for dropdown (no pagination, minimal fields)
     */
    async findAllForDropDown(): Promise<ServiceResult<ApiResponse<DropDownType[]>>> {
        return this.get('/dropdown');
    }

    /**
     * Get category by ID
     */
    async findOne(id: number): Promise<ServiceResult<ApiResponse<Category>>> {
        return this.get(`/${id}`);
    }

    /**
     * Create a new category
     */
    async create(data: Partial<Category>): Promise<ServiceResult<ApiResponse<Category>>> {
        return this.post('', data);
    }

    /**
     * Update category by ID
     */
    async update(id: number, updateData: Partial<Category>): Promise<ServiceResult<ApiResponse<Category>>> {
        return this.patch(`/${id}`, updateData);
    }

    /**
     * Delete category by ID (soft delete)
     */
    async remove(id: number): Promise<ServiceResult<void>> {
        return this.delete(`/${id}`);
    }
}

export const categoryService = new CategoryService();
