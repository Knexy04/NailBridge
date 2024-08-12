import mongoose from "mongoose";

const BenefitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Benefit', BenefitSchema);
