#!/bin/bash

# SafeMind Application Management Script
# This script provides a unified interface for managing the SafeMind application

set -e

# Configuration
BACKEND_DIR="./backend"
DB_NAME="safemind_db"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_PORT="5432"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
print_header() {
  echo -e "${BLUE}============================================${NC}"
  echo -e "${BLUE}       SafeMind Application Manager        ${NC}"
  echo -e "${BLUE}============================================${NC}"
  echo ""
}

# Show help
show_help() {
  echo -e "Usage: ./safemind.sh <command>"
  echo ""
  echo -e "Available commands:"
  echo -e "  ${GREEN}setup${NC}              - Install dependencies and set up the project"
  echo -e "  ${GREEN}dev${NC}                - Start development environment"
  echo -e "  ${GREEN}build${NC}              - Build Docker images"
  echo -e "  ${GREEN}start${NC}              - Start all services in production mode"
  echo -e "  ${GREEN}stop${NC}               - Stop all services"
  echo -e "  ${GREEN}migrate${NC}            - Run database migrations"
  echo -e "  ${GREEN}generate-client${NC}    - Generate Prisma client"
  echo -e "  ${GREEN}clean${NC}              - Remove Docker containers and volumes"
  echo -e "  ${GREEN}logs${NC}               - View logs for all services"
  echo -e "  ${GREEN}status${NC}             - Check the status of services"
  echo -e "  ${GREEN}help${NC}               - Show this help message"
  echo ""
}

# Setup project
setup() {
  echo -e "${YELLOW}Setting up the SafeMind project...${NC}"
  
  # Check if Node.js is installed
  if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js (v18+) first.${NC}"
    exit 1
  fi
  
  # Install backend dependencies
  echo -e "${YELLOW}Installing backend dependencies...${NC}"
  cd $BACKEND_DIR
  npm install
  
  # Generate Prisma client
  npx prisma generate
  
  echo -e "${GREEN}Setup completed successfully!${NC}"
  echo -e "Run './safemind.sh dev' to start the development environment"
}

# Start development environment
dev() {
  echo -e "${YELLOW}Starting development environment...${NC}"
  
  # Start PostgreSQL in Docker
  echo -e "${YELLOW}Starting PostgreSQL...${NC}"
  docker-compose up -d postgres
  
  # Start backend in development mode
  echo -e "${YELLOW}Starting backend server...${NC}"
  cd $BACKEND_DIR
  npm run dev
}

# Build Docker images
build() {
  echo -e "${YELLOW}Building Docker images...${NC}"
  docker build -t safemind-backend $BACKEND_DIR
  echo -e "${GREEN}Images built successfully!${NC}"
}

# Start all services in production mode
start() {
  echo -e "${YELLOW}Starting all services in production mode...${NC}"
  docker-compose -f docker-compose.prod.yml up -d
  echo -e "${GREEN}Services are now running!${NC}"
  echo -e "Backend API: http://localhost:5000"
}

# Stop all services
stop() {
  echo -e "${YELLOW}Stopping all services...${NC}"
  docker-compose -f docker-compose.prod.yml down
  echo -e "${GREEN}All services stopped!${NC}"
}

# Run database migrations
migrate() {
  echo -e "${YELLOW}Running database migrations...${NC}"
  cd $BACKEND_DIR
  npx prisma migrate dev
  echo -e "${GREEN}Migrations applied successfully!${NC}"
}

# Generate Prisma client
generate_client() {
  echo -e "${YELLOW}Generating Prisma client...${NC}"
  cd $BACKEND_DIR
  npx prisma generate
  echo -e "${GREEN}Prisma client generated successfully!${NC}"
}

# Clean Docker environment
clean() {
  echo -e "${YELLOW}Cleaning Docker environment...${NC}"
  docker-compose -f docker-compose.prod.yml down -v
  echo -e "${GREEN}Docker environment cleaned!${NC}"
}

# View logs
logs() {
  echo -e "${YELLOW}Viewing logs for all services...${NC}"
  docker-compose -f docker-compose.prod.yml logs -f
}

# Check status of services
status() {
  echo -e "${YELLOW}Checking status of services...${NC}"
  docker-compose -f docker-compose.prod.yml ps
}

# Main execution
print_header

# No arguments provided, show help
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

# Parse command
case "$1" in
  setup)
    setup
    ;;
  dev)
    dev
    ;;
  build)
    build
    ;;
  start)
    start
    ;;
  stop)
    stop
    ;;
  migrate)
    migrate
    ;;
  generate-client)
    generate_client
    ;;
  clean)
    clean
    ;;
  logs)
    logs
    ;;
  status)
    status
    ;;
  help)
    show_help
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    show_help
    exit 1
    ;;
esac 