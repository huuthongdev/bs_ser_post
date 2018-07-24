import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, trim: true, required: true, unique: true },
    description: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

export const Category = model('Category', categorySchema);