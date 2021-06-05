import { DBRow } from './DBRow';

/**
 * Represents a storage model in the database.
 * _idgen is used to generate IDs and is stored in the database alongside the data.
 */
export type DBStorageObject = {
    rows: DBRow[];
    _idgen: number;
};
