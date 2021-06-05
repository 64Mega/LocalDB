/**
 * An interface defining minimal DBRow implementation.
 * The `isDeleted` property is used to "soft delete" objects
 */
export interface DBRow {
    id?: number;
    isDeleted?: boolean;
}
export class LocalDB {
    get TableName(): string;
    constructor(tableName: string);
    Get(): Promise<DBRow[]>;
    GetById(id: number): Promise<DBRow>;
    Insert(row: any): Promise<DBRow>;
    Update(row: DBRow): Promise<DBRow>;
    Undelete(id: number): Promise<DBRow>;
    DeleteById(id: number, hardDelete?: boolean): Promise<boolean>;
    DeleteRow(row: DBRow, hardDelete?: boolean): Promise<boolean>;
    Sort(sortFunction?: (a: DBRow, b: DBRow) => number): Promise<LocalDB>;
    DeleteEntireDB(): Promise<void>;
}
export class DBTable<RowModel extends DBRow> {
    protected _db: LocalDB;
    constructor(tableName: string);
    GetByID(id: number): Promise<RowModel>;
    GetAll(): Promise<RowModel[]>;
    Insert(row: RowModel): Promise<RowModel>;
    DeleteRow(row: RowModel): Promise<boolean>;
    DeleteById(id: number): Promise<boolean>;
    Update(row: RowModel): Promise<RowModel>;
    protected SortData(): Promise<void>;
    ReplaceData(newData: RowModel[], confirm?: boolean): Promise<boolean>;
    MergeData(newData: RowModel[], confirm?: boolean): Promise<boolean>;
    DeleteAll(areYouSure?: boolean): Promise<boolean>;
}

//# sourceMappingURL=index.d.ts.map
