import mongoose from "mongoose";

const connectDB = async (url: string) => {
  await mongoose.connect(url).then(() => console.log("Connected!"));
};

export default connectDB;
