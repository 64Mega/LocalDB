// Typings for LocalDB

declare class LocalDB {
    public get TableName(): string;
    public constructor(tableName: string);
    public Get(): Promise<DBRow[]>;
    public GetById(id: number): Promise<DBRow>;
    public Insert(row: any): Promise<DBRow>;
    public Update(row: DBRow): Promise<DBRow>;
    public DeleteById(id: number): Promise<boolean>;
    public DeleteRow(row: DBRow): Promise<boolean>;
    public Undelete(id: number): Promise<boolean>;
    public Sort(
        sortFunction?: (a: DBRow, b: DBRow) => number
    ): Promise<LocalDB>;
    public DeleteEntireDB(): void;
}

declare class DBTable<RowModel extends DBRow> {
    protected _db: LocalDB;

    public GetById(id: number): Promise<RowModel>;
    public GetAll(): Promise<RowModel[]>;
    public Insert(row: RowModel): Promise<RowModel>;
    public DeleteRow(row: RowModel): Promise<boolean>;
    public DeleteById(id: number): Promise<boolean>;
    public Update(row: RowModel): Promise<RowModel>;
    public SortData(): void;
    public ReplaceData(newData: RowModel[], confirm: boolean): Promise<boolean>;
    public MergeData(newData: RowModel[], confirm: boolean): Promise<boolean>;
    public DeleteAll(areYouSure: boolean): Promise<boolean>;
}

declare interface DBRow {
    id?: number;
    isDeleted?: boolean;
}

declare type DBStorageObject = {
    rows: DBRow[];
    _idgen: number;
};
