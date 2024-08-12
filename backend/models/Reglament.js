import mongoose from "mongoose";

const ReglamentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    link: {
        type: String
    }
})

export default mongoose.model('Reglament', ReglamentSchema);
