import { Location } from '@/types/models/location.model';
import { ApiResponse, BaseService, PaginatedResponse, ServiceResult } from './base.service';
import { DropDownType } from '@/types/table-types';

class LocationService extends BaseService {
    constructor() {
        super('/location');
    }

    /**
     * Get all locations with pagination
     */
    async findAll(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<Location>>>> {
        return this.get('', query);
    }

    /**
     * Get all locations for dropdown (no pagination, minimal fields)
     */
    async findAllForDropDown(): Promise<ServiceResult<ApiResponse<DropDownType[]>>> {
        return this.get('/dropdown');
    }

    /**
     * Get location by ID
     */
    async findOne(id: number): Promise<ServiceResult<ApiResponse<Location>>> {
        return this.get(`/${id}`);
    }

    /**
     * Create a new location
     */
    async create(data: Partial<Location>): Promise<ServiceResult<ApiResponse<Location>>> {
        return this.post('', data);
    }

    /**
     * Update location by ID
     */
    async update(id: number, updateData: Partial<Location>): Promise<ServiceResult<ApiResponse<Location>>> {
        return this.patch(`/${id}`, updateData);
    }

    /**
     * Delete location by ID (soft delete)
     */
    async remove(id: number): Promise<ServiceResult<void>> {
        return this.delete(`/${id}`);
    }
}

export const locationService = new LocationService();
