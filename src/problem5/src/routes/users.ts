import express, { Request, Response } from 'express';
import { UserService } from '../models/User';
import { CreateUserRequest, UpdateUserRequest, UserFilters, ApiResponse, PaginatedResponse, IUserDocument } from '../types';
import { validateCreateUser, validateUpdateUser, validateUserId, validateQueryFilters } from '../middleware/validation';

const router = express.Router();
const userService = new UserService();

// POST /api/users - Create a new user
router.post('/', validateCreateUser, async (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body;
    const user = await userService.create(userData);
    
    const response: ApiResponse<IUserDocument> = {
      success: true,
      data: user,
      message: 'User created successfully'
    };
    
    res.status(201).json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Creation failed',
      message: error.message
    };
    
    const statusCode = error.message === 'Email already exists' ? 409 : 400;
    res.status(statusCode).json(response);
  }
});

// GET /api/users - List users with optional filters
router.get('/', validateQueryFilters, async (req: Request, res: Response) => {
  try {
    const filters: UserFilters = req.query as any;
    const { users, total } = await userService.findAll(filters);
    
    const limit = filters.limit || 10;
    const offset = filters.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    
    const response: PaginatedResponse<IUserDocument> = {
      success: true,
      data: users,
      pagination: {
        total,
        limit,
        offset,
        page,
        totalPages
      }
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    };
    
    res.status(500).json(response);
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', validateUserId, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);
    
    const response: ApiResponse<IUserDocument> = {
      success: true,
      data: user,
      message: 'User retrieved successfully'
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    };
    
    const statusCode = error.message === 'User not found' ? 404 : 500;
    res.status(statusCode).json(response);
  }
});

// PUT /api/users/:id - Update user by ID
router.put('/:id', validateUserId, validateUpdateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userData: UpdateUserRequest = req.body;
    const user = await userService.update(id, userData);
    
    const response: ApiResponse<IUserDocument> = {
      success: true,
      data: user,
      message: 'User updated successfully'
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Update failed',
      message: error.message
    };
    
    let statusCode = 500;
    if (error.message === 'User not found') {
      statusCode = 404;
    } else if (error.message === 'Email already exists') {
      statusCode = 409;
    } else if (error.message.includes('validation')) {
      statusCode = 400;
    }
    
    res.status(statusCode).json(response);
  }
});

// DELETE /api/users/:id - Delete user by ID
router.delete('/:id', validateUserId, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.delete(id);
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'User deleted successfully'
    };
    
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Deletion failed',
      message: error.message
    };
    
    const statusCode = error.message === 'User not found' ? 404 : 500;
    res.status(statusCode).json(response);
  }
});

export default router;