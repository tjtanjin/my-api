#!/bin/bash

# initial build
npx tsc

# move env file
cp ./.env ./build

# move swagger files
cp ./source/swagger.json ./build
cp -r ./source/swagger/ ./build

# finish
echo "Build completed."