import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

import mainConfig from '../configs/aggregator/aggregator.json';

/**
 * Retrieves JSON object based on given key.
 * 
 * @param req request object
 * @param res response object
 */
const getAggregate = async (req: Request, res: Response) => {
    const key: string = req.params.key;

    const aggregatorConfig = mainConfig[key as keyof typeof mainConfig]
    if (aggregatorConfig == undefined) {
        return res.status(404).json({});
    }

    let result = {};
    const properties = Object.keys(aggregatorConfig);
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        const propertyConfig = aggregatorConfig[property as keyof typeof aggregatorConfig];
        const propertyType = propertyConfig["type"].toUpperCase();
        if (propertyType == "STATIC") {
            result = {...result, [property]: getStaticValue(propertyConfig)};
        } else if (propertyType == "ENDPOINT") {
            result = {...result, [property]: await getEndpointValue(propertyConfig)};
        }
    }

    return res.status(200).json(result);
};

/**
 * Parses config for the property of type static.
 * 
 * @param config property config to parse
 */
const getStaticValue = (config: any) => {
    return config["fields"]["value"];
}

/**
 * Parses config for the property of type endpoint.
 * 
 * @param config property config to parse
 */
const getEndpointValue = async (config: any) => {
    const url = config["fields"]["url"]
    const method = config["fields"]["method"].toUpperCase();
    const headers = config["fields"]["headers"];
    const body = config["fields"]["body"];
    const path_to_value = config["fields"]["path_to_value"];
    try {
        let result: AxiosResponse = await axios({
            url: url,
            method: method,
            headers: headers,
            data: body
        });
        const path_breakdown = path_to_value.split(".");
        for (let i = 0; i < path_breakdown.length; i++) {
            result = result[path_breakdown[i] as keyof typeof result]
        }
        return result as unknown as string;
    } catch (err) {
        return undefined;
    }
}

export default { getAggregate };