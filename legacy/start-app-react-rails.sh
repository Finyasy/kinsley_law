#!/bin/bash

# Start Kinsley Law Advocates app (both frontend and backend)

echo "Starting Kinsley Law Advocates application..."

# Terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Change to project directory
cd "$(dirname "$0")"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
if ! command_exists node; then
  echo "Node.js is not installed. Please install Node.js to run the frontend."
  exit 1
fi

if ! command_exists ruby; then
  echo "Ruby is not installed. Please install Ruby to run the backend."
  exit 1
fi

if ! command_exists rails; then
  echo "Rails is not installed. Please install Rails to run the backend."
  exit 1
fi

# Start backend server
echo -e "${BLUE}Starting Rails backend server on port 3001...${NC}"
cd backend

# Check if bundle is installed
if ! command_exists bundle; then
  echo "Bundler is not installed. Installing bundler..."
  gem install bundler
fi

# Install dependencies
echo "Installing backend dependencies..."
bundle install

# Database setup
echo "Setting up database..."
bundle exec rails db:create
bundle exec rails db:migrate
bundle exec rails db:seed

# Start backend server in background
bundle exec rails server -p 3001 &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Start frontend server
cd ../frontend
echo -e "${GREEN}Starting React frontend server on port 3000...${NC}"

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Start frontend server in background
npm start &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# Function to handle script termination
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

# Set up trap to catch SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo -e "\n${GREEN}Kinsley Law Advocates application is running!${NC}"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001/api/v1"
echo "Press Ctrl+C to stop both servers."

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID