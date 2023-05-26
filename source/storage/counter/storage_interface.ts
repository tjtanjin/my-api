import "./sql_handler"

/**
 * Wraps the data returned by retrieval from storage.
 */
export interface CounterObj {
    success: boolean;
    message: string;
    data: {};
}

/**
 * Specifies the storage operations that may be performed.
 */
export interface StorageInterface {
    /**
     * Retrieves the value for a counter based on its given key.
     * 
     * @param key key to identify counter with
     */
    getCounterValue(key: string): Promise<CounterObj>;

    /**
     * Retrieves all counters.
     */
    getAllCounterValues(): Promise<CounterObj>;

    /**
     * Creates a new counter with given key and initial value.
     * 
     * @param key key for the new counter
     * @param value initial value for the new counter
     */
    createCounter(key: string, value: number): Promise<CounterObj>;

    /**
     * Adds a value to a counter with identified key.
     * 
     * @param key key to identify counter with
     * @param value value to add
     */
    addCount(key: string, value: number): Promise<CounterObj>;

    /**
     * Subtracts a value from a counter with identified key.
     * 
     * @param key key to identify counter with
     * @param value value to subtract
     */
    subtractCount(key: string, value: number): Promise<CounterObj>;

    /**
     * Sets a value to a counter with identified key.
     * 
     * @param key key to identify counter with
     * @param value value to set
     */
    setCount(key: string, value: number): Promise<CounterObj>;

    /**
     * Deletes a counter based on given key.
     * 
     * @param key key to identify counter with
     */
    deleteCounter(key: string): Promise<CounterObj>;
}

