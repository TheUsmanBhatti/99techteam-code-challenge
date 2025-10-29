import { Document, Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  age: number;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
  role?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
  role?: string;
}

export interface UserFilters {
  name?: string;
  email?: string;
  role?: string;
  minAge?: number;
  maxAge?: number;
  limit?: number;
  offset?: number;
  page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
}