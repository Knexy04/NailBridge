import mongoose from "mongoose";

const WorkSchema = new mongoose.Schema({
        championshipId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Championship',
        },
        participants: [
            {
                participantId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Participant',
                }
            }
        ],
        judgeId: [{
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Judge',},
            grades: [{
                title: {
                    type: String,
                    required: true,
                },
                grade: {
                    type: String,
                    required: true,
                }
            }],
            comment:{
                type: String,
            },
        }],
        linkWork: {
            type: String,
            default: '',
        },
        nominationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Nomination',
        },
        poster:{
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Work', WorkSchema);