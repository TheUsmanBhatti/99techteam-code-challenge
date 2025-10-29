import { connectToDatabase } from './connection';

async function init() {
  try {
    await connectToDatabase();
    console.log('MongoDB connection initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection initialization failed:', error);
    process.exit(1);
  }
}

init();