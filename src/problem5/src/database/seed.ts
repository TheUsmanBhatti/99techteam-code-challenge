import { connectToDatabase } from './connection';
import { User } from '../models/User';
import { IUserDocument } from '../types';

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 30,
    role: 'admin'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    age: 25,
    role: 'user'
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    age: 35,
    role: 'moderator'
  },
  {
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    age: 28,
    role: 'user'
  },
  {
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    age: 42,
    role: 'user'
  }
];

async function seed() {
  try {
    await connectToDatabase();
    
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Insert sample users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} sample users:`);
    
    createdUsers.forEach((user: IUserDocument) => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seed();