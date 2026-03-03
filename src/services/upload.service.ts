import { ApiResponse, BaseService, ServiceResult } from './base.service';

class UploadService extends BaseService {
    constructor() {
        super('/upload');
    }

    async uploadLogo(file: File): Promise<ServiceResult<ApiResponse<{ url: string }>>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.post('/logo', formData);
    }

    async uploadResume(file: File): Promise<ServiceResult<ApiResponse<{ url: string }>>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.post('/resume', formData);
    }
}

export const uploadService = new UploadService();
