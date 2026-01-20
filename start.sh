#!/bin/bash

# Movie Ticket Booking System - Start Script
# This script starts both the backend and frontend servers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Store PIDs for cleanup
BACKEND_PID=""
FRONTEND_PID=""

# Cleanup function
cleanup() {
    print_info "Shutting down servers..."

    if [ ! -z "$BACKEND_PID" ]; then
        print_info "Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
    fi

    if [ ! -z "$FRONTEND_PID" ]; then
        print_info "Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
    fi

    print_success "Servers stopped"
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Print banner
echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║     Movie Ticket Booking System - Startup Script     ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    print_error "Backend directory not found!"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    print_error "Frontend directory not found!"
    exit 1
fi

# Check if Go is installed
if ! command -v go &> /dev/null; then
    print_error "Go is not installed. Please install Go 1.24 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "Prerequisites check passed"
echo ""

# Install backend dependencies
print_info "Installing backend dependencies..."
cd backend
if [ ! -f "go.sum" ]; then
    go mod download
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi
cd ..

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi
cd ..

echo ""
print_info "Starting servers..."
echo ""

# Start backend
print_info "Starting backend server on http://localhost:8080"
cd backend
go run main.go > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
print_success "Backend started (PID: $BACKEND_PID)"

# Wait a moment for backend to start
sleep 2

# Check if backend is still running
if ! ps -p $BACKEND_PID > /dev/null; then
    print_error "Backend failed to start. Check backend.log for details."
    cat backend.log
    exit 1
fi

# Start frontend
print_info "Starting frontend server on http://localhost:3000"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
print_success "Frontend started (PID: $FRONTEND_PID)"

echo ""
print_success "All servers are running!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "Access the application:"
echo "  Frontend: ${GREEN}http://localhost:3000${NC}"
echo "  Backend:  ${GREEN}http://localhost:8080${NC}"
echo ""
print_info "Default Admin Credentials:"
echo "  Email:    ${YELLOW}admin@ticketing.com${NC}"
echo "  Password: ${YELLOW}admin123${NC}"
echo ""
print_info "Logs:"
echo "  Backend:  ${BLUE}backend.log${NC}"
echo "  Frontend: ${BLUE}frontend.log${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_warning "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
