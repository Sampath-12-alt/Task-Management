import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management';
  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.error('FATAL: MONGODB_URI environment variable is missing in production!');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
