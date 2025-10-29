# Problem 5: TypeScript Express CRUD API with MongoDB

A complete backend server built with Express.js, TypeScript, and MongoDB/Mongoose that provides a full CRUD (Create, Read, Update, Delete) interface for user management.

## � Task Requirements Verification

This project fulfills all the specified requirements:

### ✅ **1. Backend Server with ExpressJS & TypeScript**
- Built with Express.js framework
- Fully implemented in TypeScript with strict type checking
- Professional project structure and clean code architecture

### ✅ **2. Complete CRUD Interface** 
The API provides all 5 required functionalities:

1. **Create a resource** - `POST /api/users` - Create new users with validation
2. **List resources with basic filters** - `GET /api/users` - Advanced filtering by name, email, role, age range with pagination
3. **Get details of a resource** - `GET /api/users/:id` - Retrieve user by MongoDB ObjectId
4. **Update resource details** - `PUT /api/users/:id` - Update user information (partial updates supported)
5. **Delete a resource** - `DELETE /api/users/:id` - Remove users from database

### ✅ **3. Database Persistence**
- **MongoDB** database with **Mongoose ODM** for robust data persistence
- User schema with built-in validation and automatic timestamps
- Proper indexing for performance optimization
- Connection management with graceful shutdown

### ✅ **4. README.md Documentation**
- Comprehensive setup and configuration guide
- Complete API documentation with examples
- Installation instructions and troubleshooting
- Testing tools and examples provided

## 🎯 Additional Features Beyond Requirements

- **Advanced Filtering**: Multiple filter combinations (role, age range, name search)
- **Pagination**: Both limit/offset and page-based pagination support
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Professional error responses with proper HTTP status codes
- **Security**: CORS, Helmet security headers, input sanitization
- **Testing Tools**: Postman collection and cURL test scripts included
- **Logging**: Request logging with Morgan middleware
- **Type Safety**: Full TypeScript implementation with proper type definitions

## �🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, and Delete users
- **Advanced Filtering**: List users with multiple filter options (name, email, role, age range)
- **Pagination Support**: Efficient data retrieval with limit/offset or page-based pagination
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Centralized error handling with descriptive error messages
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Database**: MongoDB with Mongoose ODM for robust data persistence
- **Security**: CORS, Helmet, and other security middlewares
- **Logging**: Request logging with Morgan
- **Graceful Shutdown**: Proper server and database connection cleanup

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **MongoDB** (v4.4 or higher)

### MongoDB Installation

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Windows
Download and install from [MongoDB Official Website](https://www.mongodb.com/try/download/community)

## 🛠️ Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd src/problem5
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the `.env` file and modify if needed:
   ```bash
   cp .env .env.local
   ```

   Environment variables:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/problem5_crud_api
   DB_NAME=problem5_crud_api
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=info
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system (see prerequisites above).

5. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

## 🏃‍♂️ Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Watch Mode (auto-restart on changes)
```bash
npm run watch
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` by default.

## 🌱 Database Seeding

To populate the database with sample data:

```bash
npm run db:seed
```

This will create 5 sample users with different roles and ages for testing purposes.

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Health Check
- **GET** `/health` - Check if the API is running

### API Information
- **GET** `/info` - Get API information and available endpoints

### User Endpoints

#### 1. Create User
- **POST** `/api/users`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "role": "user"  // Optional: "user", "admin", "moderator"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "65f8b2c4a1b2c3d4e5f6g7h8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "role": "user",
      "createdAt": "2024-10-29T10:30:00.000Z",
      "updatedAt": "2024-10-29T10:30:00.000Z"
    },
    "message": "User created successfully"
  }
  ```

#### 2. List Users (with filters)
- **GET** `/api/users`
- **Query Parameters:**
  - `name` - Filter by name (partial match)
  - `email` - Filter by email (partial match)
  - `role` - Filter by role (exact match: user, admin, moderator)
  - `minAge` - Minimum age filter
  - `maxAge` - Maximum age filter
  - `limit` - Number of results per page (default: 10, max: 100)
  - `offset` - Number of results to skip
  - `page` - Page number (alternative to offset)

- **Examples:**
  ```bash
  # Get all users
  GET /api/users
  
  # Get users with pagination
  GET /api/users?limit=5&page=2
  
  # Filter by role and age
  GET /api/users?role=admin&minAge=25&maxAge=50
  
  # Search by name
  GET /api/users?name=john
  ```

- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "65f8b2c4a1b2c3d4e5f6g7h8",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "age": 30,
        "role": "user",
        "createdAt": "2024-10-29T10:30:00.000Z",
        "updatedAt": "2024-10-29T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "page": 1,
      "totalPages": 3
    }
  }
  ```

#### 3. Get User by ID
- **GET** `/api/users/:id`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "65f8b2c4a1b2c3d4e5f6g7h8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "role": "user",
      "createdAt": "2024-10-29T10:30:00.000Z",
      "updatedAt": "2024-10-29T10:30:00.000Z"
    },
    "message": "User retrieved successfully"
  }
  ```

#### 4. Update User
- **PUT** `/api/users/:id`
- **Body** (all fields optional):
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "age": 32,
    "role": "admin"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "65f8b2c4a1b2c3d4e5f6g7h8",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "age": 32,
      "role": "admin",
      "createdAt": "2024-10-29T10:30:00.000Z",
      "updatedAt": "2024-10-29T10:35:00.000Z"
    },
    "message": "User updated successfully"
  }
  ```

#### 5. Delete User
- **DELETE** `/api/users/:id`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

## 🔍 Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2024-10-29T10:30:00.000Z"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation errors)
- `404` - Resource not found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal server error

## 🧪 Testing the API

### Automated Testing Script

A comprehensive test script is provided that tests all API endpoints:

```bash
# Make sure the server is running first
npm run dev

# In another terminal, run the test script
./test_api.sh
```

The test script will:
- ✅ Test all CRUD operations
- ✅ Test filtering and pagination
- ✅ Test error handling and validation
- ✅ Verify data consistency

### Postman Collection

Import the provided Postman collection for interactive testing:

1. Open Postman
2. Import `postman_collection.json`
3. Set the `baseUrl` variable to `http://localhost:3000`
4. Run the collection or individual requests

The Postman collection includes:
- 📋 All CRUD operations with tests
- 🔍 Filtering and pagination examples
- ❌ Error case testing
- ✅ Automated test assertions

### Using cURL

#### Create a user:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "age": 25,
    "role": "user"
  }'
```

#### Get all users:
```bash
curl http://localhost:3000/api/users
```

#### Get users with filters:
```bash
# Filter by role
curl "http://localhost:3000/api/users?role=admin"

# Filter by age range
curl "http://localhost:3000/api/users?minAge=25&maxAge=40"

# Search by name with pagination
curl "http://localhost:3000/api/users?name=john&limit=5&page=1"
```

#### Get user by ID:
```bash
curl http://localhost:3000/api/users/USER_ID_HERE
```

#### Update a user:
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated User",
    "age": 26
  }'
```

#### Delete a user:
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID_HERE
```

### Using Postman or Insomnia

1. Import the API endpoints
2. Set the base URL to `http://localhost:3000`
3. Use the endpoints documented above

## 📁 Project Files

```
src/
├── database/
│   ├── connection.ts           # MongoDB connection setup
│   ├── init.ts                # Database initialization script
│   └── seed.ts                # Sample data seeding script
├── middleware/
│   ├── errorHandler.ts        # Centralized error handling
│   └── validation.ts          # Request validation middleware
├── models/
│   └── User.ts                # User Mongoose model and service layer
├── routes/
│   ├── index.ts               # Health check and info routes
│   └── users.ts               # User CRUD API routes
├── types/
│   └── index.ts               # TypeScript type definitions
└── server.ts                  # Main Express server setup

Configuration Files:
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env                      # Environment variables
├── README.md                 # This documentation

Testing Files:
├── postman_collection.json   # Postman collection for API testing
└── test_api.sh              # Automated cURL testing script
```

## 🔧 Key Files Explained

### Core Application Files
- **`src/server.ts`** - Main Express application with middleware setup and graceful shutdown
- **`src/models/User.ts`** - Mongoose model with schema validation and service methods
- **`src/routes/users.ts`** - All CRUD API endpoints with error handling
- **`src/database/connection.ts`** - MongoDB connection management with reconnection logic

### Configuration & Setup
- **`package.json`** - All required dependencies for Express, TypeScript, MongoDB, and validation
- **`tsconfig.json`** - TypeScript compiler configuration with strict type checking
- **`.env`** - Environment variables for database connection and server configuration

### Testing & Documentation
- **`postman_collection.json`** - Complete Postman collection with automated tests
- **`test_api.sh`** - Bash script to test all API endpoints with cURL
- **`README.md`** - Comprehensive setup and usage documentation

## 🏗️ Project Structure

```
src/
├── database/
│   ├── connection.ts    # MongoDB connection setup
│   ├── init.ts         # Database initialization
│   └── seed.ts         # Sample data seeding
├── middleware/
│   ├── errorHandler.ts # Error handling middleware
│   └── validation.ts   # Request validation middleware
├── models/
│   └── User.ts         # User Mongoose model and service
├── routes/
│   ├── index.ts        # Health check and info routes
│   └── users.ts        # User CRUD routes
├── types/
│   └── index.ts        # TypeScript type definitions
└── server.ts           # Main server file
```

## 🛡️ Validation Rules

### User Creation/Update
- **Name**: 2-100 characters, required for creation
- **Email**: Valid email format, unique, required for creation
- **Age**: Integer between 1-150, required for creation
- **Role**: Must be one of: "user", "admin", "moderator" (defaults to "user")

### Query Parameters
- **limit**: 1-100 (defaults to 10)
- **offset**: Non-negative integer
- **page**: Positive integer
- **minAge/maxAge**: 1-150
- **name/email**: String filters for partial matching

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Application environment (development/production)
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `DB_NAME`: Database name
- `CORS_ORIGIN`: Allowed CORS origin
- `LOG_LEVEL`: Logging level

### MongoDB Configuration
The application uses the following MongoDB settings:
- **Maximum Pool Size**: 10 connections
- **Server Selection Timeout**: 5 seconds
- **Socket Timeout**: 45 seconds
- **Automatic Reconnection**: Enabled

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `brew services start mongodb-community@7.0` (macOS)
   - Check the connection string in `.env`
   - Verify MongoDB is accessible on the specified port

2. **Port Already in Use**
   - Change the `PORT` in `.env` file
   - Kill the process using the port: `lsof -ti:3000 | xargs kill -9`

3. **TypeScript Compilation Errors**
   - Run `npm run clean` then `npm run build`
   - Check for any missing type definitions

4. **Validation Errors**
   - Ensure request body matches the expected schema
   - Check the error message for specific validation requirements

## 📄 Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start development server with ts-node
- `npm run watch` - Start development server with auto-restart
- `npm run clean` - Remove compiled files
- `npm run db:seed` - Seed database with sample data
- `npm test` - Run tests (when implemented)

## 🎯 Features Implemented

✅ **Complete CRUD Operations**
- Create new users
- List users with advanced filtering
- Get user details by ID
- Update user information
- Delete users

✅ **Advanced Filtering & Pagination**
- Filter by name, email, role, age range
- Pagination with limit/offset or page-based
- Total count and pagination metadata

✅ **Input Validation**
- Comprehensive request validation
- MongoDB ObjectId validation
- Schema validation with Joi

✅ **Error Handling**
- Centralized error handling
- Descriptive error messages
- Proper HTTP status codes

✅ **Database Integration**
- MongoDB with Mongoose ODM
- Schema validation at database level
- Proper indexing for performance

✅ **Security & Best Practices**
- CORS protection
- Helmet security headers
- Input sanitization
- Graceful shutdown handling

## 📝 License

This project is part of a coding challenge and is for educational purposes.

---

**Happy Coding! 🚀**