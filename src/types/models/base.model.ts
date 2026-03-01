export interface BaseModel {
    created_at: Date;
    updated_at?: Date | null;

    created_by?: number | null;
    updated_by?: number | null;

    deleted_at?: Date | null;
}