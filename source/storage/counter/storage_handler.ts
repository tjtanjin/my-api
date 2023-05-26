import SqlHandler from "./sql_handler";
import SqLiteHandler from "./sqlite_handler";
import { StorageInterface } from "./storage_interface";

/**
 * Determines the storage to use based on what was set in the .env file.
 */
let storageHandler: StorageInterface;
if (process.env.COUNTER_STORAGE_TYPE == "SQL") {
    storageHandler = new SqlHandler()
} else {
    storageHandler = new SqLiteHandler()
}

export default storageHandler;