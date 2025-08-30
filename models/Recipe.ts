import mongoose, { model, models, Schema } from "mongoose";

const RecipeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    image: { type: String }, // later we’ll store Cloudinary URLs
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, enum: ["user", "ai"], default: "user" },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Recipe = models.Recipe || model("Recipe", RecipeSchema);
export default Recipe;