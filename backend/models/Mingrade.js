import mongoose from "mongoose";

const MinGradeSchema = new mongoose.Schema({
    position: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    }
})

export default mongoose.model('MinGrade', MinGradeSchema);
