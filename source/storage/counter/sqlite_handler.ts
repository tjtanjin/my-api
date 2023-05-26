import { StorageInterface, CounterObj } from "./storage_interface";

/**
 * Handles the sqlite storage logic for the counter module. Refer to StorageInterface for code
 * documentation of the methods in this class.
 */
class SqLiteHandler implements StorageInterface {
    public async getCounterValue(key: string): Promise<CounterObj> {
        return {success: false, message: "Sqlite not yet supported.", data: {}};
    }

    public async getAllCounterValues(): Promise<CounterObj> {
        return {success: false, message: "Sqlite not yet supported.", data: {}};
    }

    public async createCounter(key: string, value: number): Promise<CounterObj> {
        return {success: false, message: "Sqlite not yet supported.", data: {}};
    }

    public async addCount(key: string, value: number): Promise<CounterObj> {
        return {success: false, message: "Sqlite not yet supported.", data: {}};
    }

    public async subtractCount(key: string, value: number): Promise<CounterObj> {
        return {success: false, message: "Sqlite not yet supported.", data: {}};
    }

    public async setCount(key: string, value: number): Promise<CounterObj> {
        return {success: false, message: "Sqlite not yet supported.", data: {}};
    }

    public async deleteCounter(key: string): Promise<CounterObj> {
        return {success: false, message: "Sqlite not yet supported.", data: {}};
    }
}

export default SqLiteHandler;