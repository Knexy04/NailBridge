import mongoose from "mongoose";

const JudgeRequestSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: true,
        },
        photoUrl: {
            type: String,
        },
        socialUrl: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
        },
        li_1: {
            type: String,
            required: true,
        },
        li_2: {
            type: String,
            required: true,
        },
        li_3: {
            type: String,
            required: true,
        },
        li_4: {
            type: String,
            default: "",
        },
        li_5: {
            type: String,
            default: "",
        }
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('JudgeRequest', JudgeRequestSchema);