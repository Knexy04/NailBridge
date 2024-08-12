import mongoose from "mongoose";


const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
    },
    championshipId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Championship',
    },
    teamTrainer: [{
        fullName: {
            type: String,
        }
    }]
})

export default mongoose.model('Team', TeamSchema);

