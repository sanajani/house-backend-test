import mongoose from 'mongoose';
console.log('this is env prot', process.env.MONGODB_CONNECTION_NAME);

const dbUserName = process.env.MONGODB_CONNECTION_NAME;
const dbPassword = process.env.MONGODB_CONNECTION_PASSWORD;
const dbName = process.env.MONGODB_DB_NAME || 'propertyDB'; // Add this

// Add database name to URL
const dbURL = `mongodb+srv://${dbUserName}:${dbPassword}@cluster0.qycidu4.mongodb.net/${dbName}?appName=Cluster0`;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit if can't connect
  }
};

export default connectToMongoDB;
