import { User } from '@/types/models/user.model';
import { ApiResponse, BaseService, PaginatedResponse, ServiceResult } from './base.service';

export interface UserListItemType { id: number; userName: string }


export class UserService extends BaseService {
    constructor() {
        super('/user');
    }

    /**
     * Get all subjects with pagination
     */
    async findAll(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<User>>>> {
        return this.get('', query);
    }
    /**
     * Get all teachers with pagination
     */
    async findAllTeachers(query?: Record<string, any>): Promise<ServiceResult<ApiResponse<PaginatedResponse<User>>>> {
        return this.get('/teachers', { params: query });
    }

    /**
     *  Get subject by ID
     */
    async findOne(id: number): Promise<ServiceResult<ApiResponse<User>>> {
        return this.get(`/${id}`);
    }

    /**
     *  Get all subjects for selection (dropdown) - returns simplified data
     */
    async getAllForSelect(params?: Record<string, any>): Promise<ServiceResult<UserListItemType[]>> {

        return this.get('/dropdown/list', this.cleanParams(params));
    }


    /**
     * Create a new subject
     */
    async create(data: any): Promise<ServiceResult<User>> {
        return this.post('', data);
    }

    /**
     * Update subject by ID
     */
    async update(id: number, updateData: Partial<any>): Promise<ServiceResult<User>> {
        return this.patch(`/${id}`, updateData);
    }

    /**
     * Delete subject by ID (soft delete)
     */
    async remove(id: number): Promise<ServiceResult<void>> {
        return this.delete(`/${id}`);
    }

    /**
     * Get current user profile from auth/my-profile endpoint
     * Returns full user data with relations
     */
    async getCurrentProfile(): Promise<ServiceResult<ApiResponse<{ user: User }>>> {
        return this.get('/my-profile');
    }

    /**
     * Update current user profile
     */
    async updateCurrentProfile(updateData: Partial<any>): Promise<ServiceResult<User>> {
        // Get current user first to get the ID
        const profileResponse = await this.getCurrentProfile();
        if (profileResponse.data?.data?.user?.id) {
            return this.update(profileResponse.data.data.user.id, updateData);
        }
        throw new Error('Could not get current user profile');
    }

    /**
     * Request password reset email
     */
    async requestResetPassword(email: string): Promise<ServiceResult<ApiResponse<{ message: string }>>> {
        return this.post('/request-reset-password', { email });
    }

    /**
     * Reset password with token
     */
    async resetPassword(data: { token: string; password: string; confirmPassword: string }): Promise<ServiceResult<ApiResponse<{ message: string }>>> {
        return this.post('/reset-password', data);
    }
}

export const userService = new UserService();
