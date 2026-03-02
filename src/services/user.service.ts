import { User } from '@/types/models/user.model';
import { ApiResponse, BaseService, PaginatedResponse, ServiceResult } from './base.service';

class UserService extends BaseService {
    constructor() {
        super('/user');
    }

    /**
     * Get all users with pagination
     */
    async findAll(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<User>>>> {
        return this.get('', query);
    }

    /**
     * Get user by ID
     */
    async findOne(id: number): Promise<ServiceResult<ApiResponse<User>>> {
        return this.get(`/${id}`);
    }

    /**
     * Get current authenticated user's profile
     */
    async getMyProfile(): Promise<ServiceResult<ApiResponse<{ user: User }>>> {
        return this.get('/my-profile');
    }

    /**
     * Create a new user
     */
    async create(data: Partial<User>): Promise<ServiceResult<ApiResponse<User>>> {
        return this.post('', data);
    }

    /**
     * Update user by ID
     */
    async update(id: number, updateData: Partial<User>): Promise<ServiceResult<ApiResponse<User>>> {
        return this.patch(`/${id}`, updateData);
    }

    /**
     * Delete user by ID (soft delete)
     */
    async remove(id: number): Promise<ServiceResult<void>> {
        return this.delete(`/${id}`);
    }
}

export const userService = new UserService();
