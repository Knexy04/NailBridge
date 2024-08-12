import mongoose from "mongoose";

const ReadyMembersSchema = new mongoose.Schema([{
    championshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Championship',
    },
    number: String,
    name: String,
    participants: [{
        fullName: String,
        category: String,
        team: String,
        teamTrainer: [{trainerName: String}],
        judgeGrade: [
            {
                judgeFullName: String,
                grades: [
                    {
                        title: String,
                        grade: String,
                    }
                ],
                comment: String,
            }
        ]
    }]
}])

export default mongoose.model('ReadyMember', ReadyMembersSchema);