import Joi from 'joi';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be less than 100 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    age: Joi.number().integer().min(1).max(150).required().messages({
      'number.min': 'Age must be at least 1',
      'number.max': 'Age must be less than 150',
      'any.required': 'Age is required'
    }),
    role: Joi.string().valid('user', 'admin', 'moderator').optional().messages({
      'any.only': 'Role must be one of: user, admin, moderator'
    })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: error.details[0].message
    });
    return;
  }

  next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be less than 100 characters'
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email address'
    }),
    age: Joi.number().integer().min(1).max(150).optional().messages({
      'number.min': 'Age must be at least 1',
      'number.max': 'Age must be less than 150'
    }),
    role: Joi.string().valid('user', 'admin', 'moderator').optional().messages({
      'any.only': 'Role must be one of: user, admin, moderator'
    })
  }).min(1).messages({
    'object.min': 'At least one field is required for update'
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: error.details[0].message
    });
    return;
  }

  next();
};

export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      error: 'Invalid user ID',
      message: 'User ID must be a valid MongoDB ObjectId'
    });
    return;
  }

  next();
};

export const validateQueryFilters = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().max(100).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('user', 'admin', 'moderator').optional(),
    minAge: Joi.number().integer().min(1).max(150).optional(),
    maxAge: Joi.number().integer().min(1).max(150).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    offset: Joi.number().integer().min(0).optional(),
    page: Joi.number().integer().min(1).optional()
  });

  const { error, value } = schema.validate(req.query);
  
  if (error) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: error.details[0].message
    });
    return;
  }

  // Convert page to offset if provided
  if (value.page && !value.offset) {
    const limit = value.limit || 10;
    value.offset = (value.page - 1) * limit;
    delete value.page;
  }

  req.query = value;
  next();
};