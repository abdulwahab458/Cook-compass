import mongoose, { Schema, models, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  savedRecipes: mongoose.Types.ObjectId[];
}

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        image: { type: String },
        savedRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    },
    { timestamps: true }
);
const User = models.User || model("User", userSchema);
export default User