#!/bin/bash

echo "Updating backend dependencies..."
cd backend
npm update
npm outdated

echo "Updating frontend dependencies..."
cd ../frontend
npm update
npm outdated

echo "Done!" 