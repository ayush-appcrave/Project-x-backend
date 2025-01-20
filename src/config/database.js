import mongoose from "mongoose";
import { DB_NAME } from "../config/constants.js";
import {config} from "../config/appConfig.js";
export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.mongo_db_uri}/${DB_NAME}`
    );
    console.log(`DB Connected -> ${connectionInstance.connection.host} `);
  } catch (error) {
    console.log(`MongoDB connection error ${error}`);
    throw error;
    process.exit(1);
  }
};
