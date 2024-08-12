import mongoose from "mongoose";

const NominationSchema = new mongoose.Schema({
    number:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    online:{
        type: String,
        default: false,
    },
    criteria:[
            {
                title: {
                    type: String,
                },
                criteriaStatement: {
                    type: String,
                }
            }
    ],
    championshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Championship',
    }
})

export default mongoose.model('Nomination', NominationSchema);
