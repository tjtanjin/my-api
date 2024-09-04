import mysql from 'mysql';

import { StorageInterface, CounterObj } from "./storage_interface";

// create sql pool
const pool = mysql.createPool({
	connectionLimit: Number(process.env.COUNTER_DATABASE_CONN_LIMIT),
	host: process.env.COUNTER_DATABASE_HOSTNAME,
	port: Number(process.env.COUNTER_DATABASE_PORT),
	user: process.env.COUNTER_DATABASE_USER,
	password: process.env.COUNTER_DATABASE_PASSWORD,
	database: process.env.COUNTER_DATABASE_NAME,
	timezone: "utc"
});

/**
 * Handles the sql storage logic for the counter module. Refer to StorageInterface for code
 * documentation of the methods in this class.
 */
class SqlHandler implements StorageInterface {
    public async getCounterValue(key: string): Promise<CounterObj> {
		try {
			const connection = await getConnection();
			const results = await executeQueryAndReleaseConnection(connection, "SELECT _value FROM " +
					process.env.COUNTER_DATABASE_TABLE + " WHERE _key = ?", [key]);
			if (results.length != 1) {
				return {success: false, message: "Key not found.", data: {}};
			}
			return {success: true, message: "Ok.", data: {[key]: results[0]._value}};
		} catch (err: any) {
			return {success: false, message: err.message, data: {}};
		}
    }

	public async getAllCounterValues(): Promise<CounterObj> {
		try {
			const connection = await getConnection();
			const results = await executeQueryAndReleaseConnection(connection, "SELECT _key, _value FROM " + process.env.COUNTER_DATABASE_TABLE, []);

			let container: Object = {};
			for (let i = 0; i < results.length; i++) {
				const entry = results[i];
				container[entry._key as keyof typeof container] = entry._value; 
			}
			return {success: true, message: "Ok.", data: container};
		} catch (err: any) {
			return {success: false, message: err.message, data: {}};
		}	
    }

    public async createCounter(key: string, value: number): Promise<CounterObj> {
		try {
			const connection = await getConnection();
			const results = await executeQueryAndReleaseConnection(connection, "INSERT INTO " +
					process.env.COUNTER_DATABASE_TABLE + " (_key, _value) VALUES (?, ?)", [key, value]);
			
			if (results.affectedRows != 1) {
				return {success: false, message: "Unable to create counter with given key - has it already been created?", data: {}};
			}
			return {success: true, message: "Ok.", data: {[key]: value}};
		} catch (err: any) {
			return {success: false, message: err.message, data: {}};
		}
    }

    public async addCount(key: string, value: number): Promise<CounterObj> {
		return await updateCounterValue(key, value, "ADD")
    }

    public async subtractCount(key: string, value: number): Promise<CounterObj> {
		return await updateCounterValue(key, value, "SUBTRACT");
    }

    public async setCount(key: string, value: number): Promise<CounterObj> {
		return await updateCounterValue(key, value, "SET");
    }

    public async deleteCounter(key: string): Promise<CounterObj> {
		try {
			const connection = await getConnection();	
			const results = await executeQueryAndReleaseConnection(connection, "DELETE FROM " +
					process.env.COUNTER_DATABASE_TABLE + " WHERE _key = ?", [key]);
			
			if (results.affectedRows != 1) {
				return {success: false, message: "Counter could not be deleted as it does not exist.", data: {}};
			}
			return {success: true, message: "Ok.", data: {key: key}};
		} catch (err: any) {
			return {success: false, message: err.message, data: {}};
		}
    }
}
  
// Function to update the counter value (add, subtract or set)
const updateCounterValue = async (key: string, value: number, action: string): Promise<CounterObj> => {
    try {
        const connection = await getConnection();
        await beginTransaction(connection);
        const selectResults = await executeQueryNoReleaseConnection(connection, "SELECT _value FROM " +
				process.env.COUNTER_DATABASE_TABLE + " WHERE _key = ?", [key]);
        
        if (selectResults.length !== 1) {
            await rollbackAndReleaseConnection(connection, "Unable to find specified counter.");
            return {success: false, message: "Unable to find specified counter.", data: {}};
        }
        
        let counterValue = Number(selectResults[0]._value);
        if (action === "ADD") {
            counterValue += value;
        } else if (action === "SUBTRACT") {
            counterValue -= value;
        } else {
            counterValue = value;
        }
        
        const updateResults = await executeQueryNoReleaseConnection(connection, "UPDATE " + process.env.COUNTER_DATABASE_TABLE +
				" SET _value = ? WHERE _key = ?", [counterValue, key]);
        
        if (updateResults.affectedRows !== 1) {
            await rollbackAndReleaseConnection(connection, "Unable to update counter.");
            return {success: false, message: "Unable to update counter.", data: {}};
        }
        
        await commitAndReleaseConnection(connection);
        return {success: true, message: "Ok.", data: { [key]: counterValue}};
    } catch (err: any) {
        return {success: false, message: err.message, data: {}};
    }
};

const getConnection = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
};

const beginTransaction = (connection: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err: any) => {
            if (err) {
                connection.release();
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const executeQueryAndReleaseConnection = (connection: any, query: string, values: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err: any, results: any) => {
            connection.release();
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const executeQueryNoReleaseConnection = (connection: any, query: string, values: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err: any, results: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const rollbackAndReleaseConnection = async (connection: any, errorMessage: string): Promise<void> => {
    await rollbackTransaction(connection);
    connection.release();
    throw new Error(errorMessage);
};

const rollbackTransaction = (connection: any): Promise<void> => {
    return new Promise((resolve) => {
        connection.rollback(() => {
            resolve();
        });
    });
};

const commitAndReleaseConnection = async (connection: any): Promise<void> => {
    await commitTransaction(connection);
    connection.release();
};

const commitTransaction = (connection: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        connection.commit((err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export default SqlHandler;