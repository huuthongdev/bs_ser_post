import { model, Schema } from "mongoose";

const userSchema = new Schema({
    email: { type: String, trim: true, required: true, unique: true },
    phone: { type: String, trim: true, unique: true },
    password: { type: String, trim: true, required: true },
    register_at: { type: Date, default: Date.now() },
    isActive: { type: Boolean, default: false },
    role: { type: String, trim: true, default: 'Client' },
    profile: {
        name: { type: String, trim: true },
        address: { type: String, trim: true },
        birthday: { type: Date },
        imgProfile: { type: String, trim: true }
    }

});

export const User = model("User", userSchema);