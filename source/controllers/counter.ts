import { Request, Response } from 'express';
import storageHandler from '../storage/counter/storage_handler';
import { CounterObj } from '../storage/counter/storage_interface';
import { parseBool } from '../utils';

const API_KEY = process.env.COUNTER_API_KEY;

/**
 * Retrieves the value for a counter based on its given key.
 * 
 * @param req request object
 * @param res response object
 */
const getCounter = async (req: Request, res: Response) => {
    if (parseBool(process.env.COUNTER_PERM_GET_COUNTER) && !isValidApiKey(req.headers["x-api-key"] as string)) {
        return res.status(401).json({success: false, data: {}});
    }
    const key: string = req.params.key;

    const result = await storageHandler.getCounterValue(key);
    let status = 404;
    if (result.success) {
        status = 200;
    }

    return res.status(status).json(result);
};

/**
 * Retrieves all counters.
 * 
 * @param req request object
 * @param res response object
 */
const getAllCounters = async (req: Request, res: Response) => {
    if (parseBool(process.env.COUNTER_PERM_GET_ALL_COUNTERS) && !isValidApiKey(req.headers["x-api-key"] as string)) {
        return res.status(401).json({success: false, data: {}});
    }

    const result = await storageHandler.getAllCounterValues();
    let status = 404;
    if (result.success) {
        status = 200;
    }

    return res.status(status).json(result);
};

/**
 * Creates a new counter with given key and initial value.
 * 
 * @param req request object
 * @param res response object
 */
const createCounter = async (req: Request, res: Response) => {
    if (parseBool(process.env.COUNTER_PERM_CREATE_COUNTER) && !isValidApiKey(req.headers["x-api-key"] as string)) {
        return res.status(401).json({success: false, data: {}});
    }
    const key: string = req.body.key;
    const value: number = req.body.value;

    const result = await storageHandler.createCounter(key, value);
    let status = 404;
    if (result.success) {
        status = 200;
    }

    return res.status(status).json(result);
};

/**
 * Updates a counter based on given key, value and action.
 * 
 * @param req request object
 * @param res response object
 */
const updateCounter = async (req: Request, res: Response) => {
    if (parseBool(process.env.COUNTER_PERM_UPDATE_COUNTER) && !isValidApiKey(req.headers["x-api-key"] as string)) {
        return res.status(401).json({success: false, data: {}});
    }
    const key: string = req.body.key;
    const value: number = req.body.value;
    const action: string = req.body.action.toUpperCase();

    let result: CounterObj;
    if (action == "ADD") {
        result = await storageHandler.addCount(key, value);
    } else if (action == "SUBTRACT") {
        result = await storageHandler.subtractCount(key, value);
    } else if (action == "SET") {
        result = await storageHandler.setCount(key, value);
    } else {
        return res.status(404).json({success: false, data: {}})
    }

    let status = 404;
    if (result.success) {
        status = 200;
    }

    return res.status(status).json(result);
};

/**
 * Deletes a counter based on given key.
 * 
 * @param req request object
 * @param res response object
 */
const deleteCounter = async (req: Request, res: Response) => {
    if (parseBool(process.env.COUNTER_PERM_DELETE_COUNTER) && !isValidApiKey(req.headers["x-api-key"] as string)) {
        return res.status(401).json({success: false, data: {}});
    }
    const key: string = req.body.key;

    const result = await storageHandler.deleteCounter(key);
    let status = 404;
    if (result.success) {
        status = 200;
    }

    return res.status(status).json(result);
};

/**
 * Checks if provided api key is valid.
 * 
 * @param apiKey api key provided in the request to check
 */
const isValidApiKey = (apiKey: string) => {
    return apiKey === API_KEY;
}

export default { getCounter, getAllCounters, createCounter, updateCounter, deleteCounter };