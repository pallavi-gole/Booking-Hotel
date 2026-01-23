import mongoose from "mongoose"

const hotelSchema = new mongoose.Schema({
    hotelName: { type: String, require: true},
    hotelAddress: {type: String, require: true},
    rating: {type: String, require: true},
    price: {type: String, require: true},
    amenities: {type: String, require: true},
    image: {type: String, require: true},
    owner: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true });

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
