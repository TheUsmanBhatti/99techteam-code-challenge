import express, { Request, Response } from 'express';

const router = express.Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info endpoint
router.get('/info', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'User CRUD API with MongoDB',
      version: '1.0.0',
      description: 'A TypeScript Express.js CRUD API for user management using MongoDB and Mongoose',
      endpoints: {
        users: {
          'POST /api/users': 'Create a new user',
          'GET /api/users': 'List users with optional filters',
          'GET /api/users/:id': 'Get user by ID',
          'PUT /api/users/:id': 'Update user by ID',
          'DELETE /api/users/:id': 'Delete user by ID'
        }
      },
      filters: {
        name: 'Filter by name (partial match)',
        email: 'Filter by email (partial match)',
        role: 'Filter by role (exact match: user, admin, moderator)',
        minAge: 'Minimum age filter',
        maxAge: 'Maximum age filter',
        limit: 'Number of results per page (default: 10, max: 100)',
        offset: 'Number of results to skip',
        page: 'Page number (alternative to offset)'
      }
    }
  });
});

export default router;