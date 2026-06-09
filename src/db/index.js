import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`,
      {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      },
    );

    console.log(
      ` ✅ MongoDb connected !  DB host:${connectionInstance.connection.host} \n`,
    );
  } catch (error) {
    console.log("❌ MongoDb Connection error", error);
    process.exit(1);
  }
};


export default connectDB;