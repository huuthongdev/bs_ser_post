import { model, Schema } from "mongoose";

const postSchema = new Schema({
    title: { type: String, required: true, trim: true, unique: true },
    excerpt: { type: String, trim: true },
    content: { type: String, trim: true, required: true },
    thumbnail: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    // Author
    create_at: { type: Date, default: Date.now() },
    create_by: { type: Schema.Types.ObjectId, ref: 'User' },
    // Time Stamp
    timeStamp: {
        udpate_at: { type: Date },
        update_by: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    // Modified history
    modified: [{
        timeStamp: {
            udpate_at: { type: Date },
            update_by: { type: Schema.Types.ObjectId, ref: 'User' },
        },
        title: { type: String, required: true, trim: true },
        excerpt: { type: String, trim: true, required: true },
        content: { type: String, trim: true, required: true },
        thumbnail: { type: String, trim: true },
        isActive: { type: Boolean, default: true }

    }]
});

export const Post = model('Post', postSchema);