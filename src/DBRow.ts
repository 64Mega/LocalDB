/**
 * An interface defining minimal DBRow implementation.
 * The `isDeleted` property is used to "soft delete" objects
 */
export interface DBRow {
    id?: number;
    isDeleted?: boolean;
}
