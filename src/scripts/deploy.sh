#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Start the application
echo "Starting the application..."
npm start

# Start monitoring
echo "Starting monitoring..."
npm run monitor 