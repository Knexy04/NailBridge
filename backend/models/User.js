import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true
        },
        isAdmin:{
            type: Boolean,
            required: true,
            default: false,
        }
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('User', UserSchema);