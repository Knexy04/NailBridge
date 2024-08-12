import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        team_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            default: null,
        },
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        role:{
            type: String,
            default: '',
        },
        profileLink: {
            type: String,
            required: true,
        },
        benefitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Benefit',
            default: null,
        },
        linkBenefitPhoto: {
            type:String,
            default : '',
        },
        championshipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Championship',
        },
        payment: {
            type: Boolean,
            required: true,
        },
        company:{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Participant', ParticipantSchema);