/**
 * Table Class Type
 * Derive your table models from this class and use it to access your data.
 */

import { DBRow } from './DBRow';
import LocalDB from './LocalDB';

class DBTable<RowModel extends DBRow> {
    protected _db: LocalDB = null;

    async GetByID(id: number): Promise<RowModel> {
        return (await this._db.GetById(id)) as RowModel;
    }

    async GetAll(): Promise<RowModel[]> {
        return (await this._db.Get()) as RowModel[];
    }

    async Insert(row: RowModel): Promise<RowModel> {
        const res = (await this._db.Insert(row)) as RowModel;
        return Promise.resolve(res);
    }

    async DeleteRow(row: RowModel): Promise<boolean> {
        return await this._db.DeleteRow(row);
    }

    async DeleteById(id: number): Promise<boolean> {
        return await this._db.DeleteById(id);
    }

    async Update(row: RowModel): Promise<RowModel> {
        if (row.id) {
            return (await this._db.Update(row)) as RowModel;
        } else {
            // Create if doesn't exist
            return await this.Insert(row);
        }
    }

    protected async SortData(): Promise<void> {
        await this._db.Sort((a: DBRow, b: DBRow) => {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
        });
    }

    async ReplaceData(
        newData: RowModel[],
        confirm: boolean = false
    ): Promise<boolean> {
        if (confirm) {
            await this._db.DeleteEntireDB();
            newData.forEach(async (row) => {
                await this.Insert(row);
            });
            await this.SortData();
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    async MergeData(
        newData: RowModel[],
        confirm: boolean = false
    ): Promise<boolean> {
        if (confirm) {
            newData.forEach(async (row) => {
                if (row.id) {
                    delete row.id;
                }
                await this.Insert(row);
            });
            await this.SortData();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    async DeleteAll(areYouSure: boolean = false): Promise<boolean> {
        if (areYouSure) {
            this._db.DeleteEntireDB();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
}

export default DBTable;
