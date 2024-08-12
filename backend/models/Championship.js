import mongoose from "mongoose";

const ChampionshipSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        results: {
            type: Boolean,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endRegDate:{
            type: Date,
            required: true,
        },
        startOfflineJudgeDate:{
            type: Date,
            required: true,
        },
        endOfflineJudgeDate:{
            type: Date,
            required: true,
        },
        startOnlineJudgeDate:{
            type: Date,
            required: true,
        },
        endOnlineJudgeDate:{
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },
        logoImage: {
            type: String,
            required: true
        },
        image1: {
            type: String,
        },
        image2: {
            type: String,
        }
    },
    {
        timestamps: true,
    })

export default mongoose.model('Championship', ChampionshipSchema);