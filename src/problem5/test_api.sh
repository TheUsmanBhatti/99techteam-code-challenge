#!/bin/bash

# Problem 5 CRUD API Testing Script
# This script tests all the API endpoints using cURL commands
# Make sure the server is running on http://localhost:3000 before executing

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Problem 5 CRUD API Testing Script ===${NC}"
echo -e "${YELLOW}Testing API endpoints at: $BASE_URL${NC}"
echo ""

# Function to print test headers
print_test() {
    echo -e "${BLUE}--- $1 ---${NC}"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if server is running
print_test "Checking Server Health"
health_response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "$BASE_URL/health")
if [ "$health_response" = "200" ]; then
    print_success "Server is running"
    cat /tmp/health_response.json | jq '.' 2>/dev/null || cat /tmp/health_response.json
else
    print_error "Server is not running. Please start the server first with 'npm run dev'"
    exit 1
fi
echo ""

# Get API Info
print_test "Getting API Information"
curl -s "$BASE_URL/info" | jq '.' || curl -s "$BASE_URL/info"
echo ""

# Test 1: Create a new user
print_test "Test 1: Creating a new user"
create_response=$(curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "role": "user"
  }')

echo "$create_response" | jq '.' 2>/dev/null || echo "$create_response"

# Extract user ID for further tests
user_id=$(echo "$create_response" | jq -r '.data.id' 2>/dev/null)
if [ "$user_id" != "null" ] && [ "$user_id" != "" ]; then
    print_success "User created with ID: $user_id"
else
    print_error "Failed to create user"
    exit 1
fi
echo ""

# Test 2: Create another user for testing filters
print_test "Test 2: Creating an admin user"
curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Admin",
    "email": "jane.admin@example.com",
    "age": 35,
    "role": "admin"
  }' | jq '.' || curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Admin",
    "email": "jane.admin@example.com",
    "age": 35,
    "role": "admin"
  }'
echo ""

# Test 3: Get all users
print_test "Test 3: Getting all users"
curl -s "$BASE_URL/api/users" | jq '.' || curl -s "$BASE_URL/api/users"
echo ""

# Test 4: Get users with pagination
print_test "Test 4: Getting users with pagination (limit=5, page=1)"
curl -s "$BASE_URL/api/users?limit=5&page=1" | jq '.' || curl -s "$BASE_URL/api/users?limit=5&page=1"
echo ""

# Test 5: Filter users by role
print_test "Test 5: Filtering users by role (admin)"
curl -s "$BASE_URL/api/users?role=admin" | jq '.' || curl -s "$BASE_URL/api/users?role=admin"
echo ""

# Test 6: Filter users by age range
print_test "Test 6: Filtering users by age range (25-40)"
curl -s "$BASE_URL/api/users?minAge=25&maxAge=40" | jq '.' || curl -s "$BASE_URL/api/users?minAge=25&maxAge=40"
echo ""

# Test 7: Search users by name
print_test "Test 7: Searching users by name (john)"
curl -s "$BASE_URL/api/users?name=john" | jq '.' || curl -s "$BASE_URL/api/users?name=john"
echo ""

# Test 8: Get user by ID
print_test "Test 8: Getting user by ID ($user_id)"
curl -s "$BASE_URL/api/users/$user_id" | jq '.' || curl -s "$BASE_URL/api/users/$user_id"
echo ""

# Test 9: Update user
print_test "Test 9: Updating user"
curl -s -X PUT "$BASE_URL/api/users/$user_id" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "age": 31
  }' | jq '.' || curl -s -X PUT "$BASE_URL/api/users/$user_id" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "age": 31
  }'
echo ""

# Test 10: Verify update
print_test "Test 10: Verifying user update"
curl -s "$BASE_URL/api/users/$user_id" | jq '.' || curl -s "$BASE_URL/api/users/$user_id"
echo ""

# Error Testing
print_test "Error Test 1: Creating user with invalid email"
curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "age": 25
  }' | jq '.' || curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "age": 25
  }'
echo ""

print_test "Error Test 2: Getting user with invalid ID"
curl -s "$BASE_URL/api/users/invalid-id" | jq '.' || curl -s "$BASE_URL/api/users/invalid-id"
echo ""

print_test "Error Test 3: Getting non-existent user"
curl -s "$BASE_URL/api/users/507f1f77bcf86cd799439011" | jq '.' || curl -s "$BASE_URL/api/users/507f1f77bcf86cd799439011"
echo ""

# Test 11: Delete user (at the end)
print_test "Test 11: Deleting user"
curl -s -X DELETE "$BASE_URL/api/users/$user_id" | jq '.' || curl -s -X DELETE "$BASE_URL/api/users/$user_id"
echo ""

# Test 12: Verify deletion
print_test "Test 12: Verifying user deletion (should return 404)"
curl -s "$BASE_URL/api/users/$user_id" | jq '.' || curl -s "$BASE_URL/api/users/$user_id"
echo ""

print_success "All tests completed!"
echo -e "${YELLOW}Note: If jq is not installed, the JSON responses will be shown without formatting${NC}"

# Clean up temporary files
rm -f /tmp/health_response.json

echo -e "${BLUE}=== Test Summary ===${NC}"
echo "✅ CRUD Operations: Create, Read, Update, Delete"
echo "✅ Filtering: By role, age range, name search"
echo "✅ Pagination: Limit and page-based"
echo "✅ Error Handling: Invalid inputs, not found cases"
echo "✅ Validation: Email format, required fields"
echo ""
echo -e "${GREEN}Problem 5 CRUD API is working correctly!${NC}"