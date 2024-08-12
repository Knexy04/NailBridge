import mongoose from "mongoose";

const JudgeSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: true,
        },
        photoUrl: {
            type: String,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
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
        },
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        championshipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Championship',
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Judge', JudgeSchema);