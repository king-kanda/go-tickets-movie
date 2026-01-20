#!/bin/bash

# Stop script - kills all running backend and frontend processes

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "Stopping Movie Ticket Booking System..."
echo ""

# Stop Go backend
GO_PIDS=$(pgrep -f "go run main.go" 2>/dev/null || true)
if [ ! -z "$GO_PIDS" ]; then
    echo -e "${YELLOW}Stopping Go backend processes...${NC}"
    kill $GO_PIDS 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Backend stopped"
else
    echo -e "${YELLOW}No backend processes found${NC}"
fi

# Stop Next.js frontend
NEXT_PIDS=$(pgrep -f "next dev" 2>/dev/null || true)
if [ ! -z "$NEXT_PIDS" ]; then
    echo -e "${YELLOW}Stopping Next.js frontend processes...${NC}"
    kill $NEXT_PIDS 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Frontend stopped"
else
    echo -e "${YELLOW}No frontend processes found${NC}"
fi

# Stop npm processes
NPM_PIDS=$(pgrep -f "npm run dev" 2>/dev/null || true)
if [ ! -z "$NPM_PIDS" ]; then
    echo -e "${YELLOW}Stopping npm processes...${NC}"
    kill $NPM_PIDS 2>/dev/null || true
    echo -e "${GREEN}✓${NC} npm processes stopped"
fi

echo ""
echo -e "${GREEN}All servers stopped${NC}"
echo ""
