import fs from "fs";
import path from "path";

/**
 * Parses a value to see if it is true or false.
 * 
 * @param bool value to check
 */
export const parseBool = (bool: any) => {
    if (bool === "true") {
        return true;
    } else {
        return false;
    }
}

/**
 * Generates swagger docs paths from the JSON files in the swagger directory.
 */
export const parseSwaggerDocs = () => {
    const jsonsInDir = fs.readdirSync(path.join(__dirname, "./swagger")).filter(file => path.extname(file) === '.json');
    let result = {};
    jsonsInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join(__dirname, './swagger', file));
        result = {...result, ...JSON.parse(fileData.toString())};
    });
    return result;
}