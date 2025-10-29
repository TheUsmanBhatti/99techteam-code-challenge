import mongoose, { Schema, Model } from 'mongoose';
import { IUser, IUserDocument, CreateUserRequest, UpdateUserRequest, UserFilters } from '../types';

// Define the User schema
const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [150, 'Age must be less than 150']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  versionKey: false // Disable the __v field
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ age: 1 });
userSchema.index({ name: 'text', email: 'text' }); // Text search index

// Transform the output to remove _id and __v fields and add id
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
    delete (ret as any).__v;
    return ret;
  }
});

// Create the User model
export const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);

// User service class with CRUD operations
export class UserService {
  async create(userData: CreateUserRequest): Promise<IUserDocument> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        throw new Error(messages.join(', '));
      }
      throw error;
    }
  }

  async findAll(filters: UserFilters = {}): Promise<{ users: IUserDocument[]; total: number }> {
    const { 
      name, 
      email, 
      role, 
      minAge, 
      maxAge, 
      limit = 10, 
      offset = 0 
    } = filters;

    // Build query object
    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (role) {
      query.role = role;
    }

    if (minAge !== undefined || maxAge !== undefined) {
      query.age = {};
      if (minAge !== undefined) query.age.$gte = minAge;
      if (maxAge !== undefined) query.age.$lte = maxAge;
    }

    // Get total count and users in parallel
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .exec()
    ]);

    return { users, total };
  }

  async findById(id: string): Promise<IUserDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID format');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async update(id: string, userData: UpdateUserRequest): Promise<IUserDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID format');
    }

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: userData },
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validations
        }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        throw new Error(messages.join(', '));
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID format');
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
  }

  async exists(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const user = await User.findById(id).select('_id');
    return !!user;
  }
}