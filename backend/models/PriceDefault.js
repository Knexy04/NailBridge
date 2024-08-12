import mongoose from "mongoose";

const PriceDefaultSchema = new mongoose.Schema({
    price:{
        type: Number,
        required: true,
        default: 4500,
    }
})

export default mongoose.model('PriceDefault', PriceDefaultSchema);
