#!/bin/bash

# initial build
npx tsc

# move env file
cp ./.env ./build

# move swagger files
cp ./src/swagger.json ./build
cp -r ./src/swagger/ ./build

# finish
echo "Build completed."