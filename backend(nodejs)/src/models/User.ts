import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    image: { type: String },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    methods: {
      userCount(): any {
        return mongoose.model("User").count();
      },
    },

    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

export default mongoose.model("User", UserSchema);
