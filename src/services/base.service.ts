import http from '@/lib/http';

export interface ExportOptions {
    params?: Record<string, any>;
    headers?: any;
    fileName?: string;
    format: 'pdf' | 'csv';
}

export interface ApiError {
    statusCode: number;
    message: string;
    details?: any;
    success?: boolean;
}

export interface ServiceResult<T> {
    data?: T;
    error?: ApiError;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export abstract class BaseService {
    protected baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Clean parameters by removing null, undefined, empty strings, and empty arrays
     */
    protected cleanParams(params?: Record<string, any>): Record<string, any> | undefined {
        if (!params) return undefined;

        const cleanedParams: Record<string, any> = {};

        for (const [key, value] of Object.entries(params)) {
            // Skip null, undefined, empty strings, and empty arrays
            if (value !== null &&
                value !== undefined &&
                value !== '' &&
                !(Array.isArray(value) && value.length === 0)) {
                cleanedParams[key] = value;
            }
        }

        // Return undefined if no valid params remain
        return Object.keys(cleanedParams).length === 0 ? undefined : cleanedParams;
    }

    /**
     * GET request
     */
    protected async get<T>(endpoint: string, params?: Record<string, any>, config?: any): Promise<ServiceResult<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const cleanedParams = this.cleanParams(params ?? {});

            const response = await http.get(url, {
                params: cleanedParams,
                ...config
            });

            return { data: response.data };
        } catch (error: any) {
            return { error: this.handleError(error) };
        }
    }

    /**
     * POST request
     */
    protected async post<T>(endpoint: string, data?: any): Promise<ServiceResult<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await http.post(url, data);
            return { data: response.data };
        } catch (error: any) {
            return { error: this.handleError(error) };
        }
    }

    /**
     * PUT request
     */
    protected async put<T>(endpoint: string, data?: any): Promise<ServiceResult<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await http.put(url, data);
            return { data: response.data };
        } catch (error: any) {
            return { error: this.handleError(error) };
        }
    }

    /**
     * PATCH request
     */
    protected async patch<T>(endpoint: string, data?: any): Promise<ServiceResult<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await http.patch(url, data);
            return { data: response.data };
        } catch (error: any) {
            return { error: this.handleError(error) };
        }
    }

    /**
     * DELETE request
     */
    protected async delete<T>(endpoint: string): Promise<ServiceResult<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await http.delete(url);
            return { data: response.data };
        } catch (error: any) {
            return { error: this.handleError(error) };
        }
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: any): ApiError {
        return {
            statusCode: error.response?.status || 500,
            message: error.response?.data?.message || error.message || 'An error occurred',
            details: error.response?.data || error
        };
    }
}
