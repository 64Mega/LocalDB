/**
 * LocalDB - uses LocalStorage to provide a basic datastore that
 * utilizes some features that are similar to real Database implementations.
 * Useful for scaffolding something out that you're going to replace with actual DB
 * connections later, or for creating a quick storage system for tools and/or PWAs.
 */

import { DBRow } from './DBRow';
import { DBStorageObject } from './DBStorageObject';

class LocalDB {
    private _tableName: string = 'default';

    private _storage: DBStorageObject = {
        rows: [],
        _idgen: 1,
    };

    public get TableName(): string {
        return this._tableName;
    }

    constructor(tableName: string) {
        this._tableName = tableName;
        this.ReadDB(true);
    }

    // Public Methods
    async Get(): Promise<DBRow[]> {
        await this.ReadDB();
        const rows = this._storage.rows.filter((x) => !x.isDeleted);
        return Promise.resolve(rows);
    }

    async GetById(id: number): Promise<DBRow> {
        await this.ReadDB();
        const row = this._storage.rows.find((x) => x.id === id);
        return Promise.resolve(row);
    }

    async Insert(row: any): Promise<DBRow> {
        await this.ReadDB();
        const id = await this.GenerateID();
        const dbRow = {
            id,
            ...row,
        };

        this._storage.rows.push(dbRow);
        await this.WriteDB();

        return Promise.resolve(dbRow);
    }

    async Update(row: DBRow): Promise<DBRow> {
        await this.ReadDB();
        let updatedRow = null;
        const index = this._storage.rows.findIndex((x) => x.id === row.id);
        if (index >= 0) {
            let oldRow = this._storage.rows[index];
            this._storage.rows[index] = { ...oldRow, ...row };
            await this.WriteDB();
            return Promise.resolve(this._storage.rows[index]);
        } else {
            throw new Error(
                `Matching id '${row.id}' not found in ${this.TableName} (LocalDB->Update).`
            );
        }
    }

    async Undelete(id: number): Promise<DBRow> {
        await this.ReadDB();
        const index = this._storage.rows.findIndex((x) => x.id === id);

        if (index >= 0) {
            this._storage.rows[index].isDeleted = undefined;
            await this.WriteDB();
            return Promise.resolve(this._storage.rows[index]);
        } else {
            throw new Error(
                `Matching id '${id}' not found in ${this.TableName} (LocalDB->Undelete).`
            );
        }
    }

    async DeleteById(id: number, hardDelete: boolean = true): Promise<boolean> {
        await this.ReadDB();
        const index = this._storage.rows.findIndex((x) => x.id === id);
        if (index >= 0) {
            if (hardDelete) {
                this._storage.rows.splice(index, 1);
            } else {
                this._storage.rows[index].isDeleted = true;
            }
            await this.WriteDB();
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    async DeleteRow(row: DBRow, hardDelete: boolean = true): Promise<boolean> {
        return await this.DeleteById(row.id, hardDelete);
    }

    async Sort(
        sortFunction?: (a: DBRow, b: DBRow) => number
    ): Promise<LocalDB> {
        await this.ReadDB();
        this._storage.rows.sort(sortFunction);
        await this.WriteDB();
        return Promise.resolve(this);
    }

    async DeleteEntireDB() {
        this._storage._idgen = 1;
        this._storage.rows = [];
        await this.WriteDB();
    }

    // Internal Methods
    private async ReadDB(createIfNotExists: boolean = false): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const strStorageObject = localStorage.getItem(this.TableName);
            if (strStorageObject !== null) {
                this._storage = JSON.parse(strStorageObject);
                resolve(true);
            } else {
                if (createIfNotExists) {
                    resolve(await this.WriteDB());
                } else {
                    reject(`Table ${this.TableName} does not exist!`);
                }
            }
        });
    }

    private async WriteDB(): Promise<any> {
        return new Promise((resolve) => {
            const json = JSON.stringify(this._storage);
            localStorage.setItem(this.TableName, json);
            resolve(true);
        });
    }

    private async GenerateID(): Promise<number> {
        await this.ReadDB();
        const id = this._storage._idgen++;
        await this.WriteDB();
        return Promise.resolve(id);
    }
}

export default LocalDB;
