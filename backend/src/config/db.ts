import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
  } catch (error) {
    if(process.env.NODE_ENV !== 'production') {
      console.error(`Error: ${error}`);
    }
    process.exit(1);
  }
};


const connection = mongoose.connection;

connection.on("connected", () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log("MongoDB connection established successfully.");
    return;
  }
  console.log("MongoDB connection established.");
});

connection.on("error", (error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`MongoDB connection error: ${error}`);
    return;
  }
  console.error("MongoDB connection error.");
});

connection.on("disconnected", () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log("MongoDB connection disconnected.");
    return;
  }
  console.log("MongoDB connection disconnected.");
})