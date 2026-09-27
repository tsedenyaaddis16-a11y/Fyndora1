import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pathfinder';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection note: Unable to connect to ${uri}`);
    console.warn(`   Reason: ${error.message}`);
    console.warn(`   Tip: Ensure MongoDB service is running, or set MONGODB_URI to a cloud database (e.g. MongoDB Atlas) in server/.env`);
    return false;
  }
};
