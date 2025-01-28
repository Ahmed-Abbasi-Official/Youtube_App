import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB Connected! HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB ERROR: ===> ", error.message);
    throw error;
  }
};

export default connectDB;
