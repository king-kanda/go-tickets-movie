#!/bin/bash

# Simple development start script with live output
# Shows both backend and frontend logs in the terminal

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║     Movie Ticket Booking System - Dev Mode           ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${BLUE}Shutting down servers...${NC}"
    pkill -P $$ 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${GREEN}[BACKEND]${NC} Starting on http://localhost:8080"
cd backend
go run main.go 2>&1 | sed "s/^/[BACKEND] /" &
cd ..

sleep 2

# Start frontend
echo -e "${GREEN}[FRONTEND]${NC} Starting on http://localhost:3000"
cd frontend
npm run dev 2>&1 | sed "s/^/[FRONTEND] /" &
cd ..

echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "Admin:    admin@ticketing.com / admin123"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Wait for all background jobs
wait
