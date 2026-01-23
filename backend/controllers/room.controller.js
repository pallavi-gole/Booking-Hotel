import Room from "../models/room.model.js";

// add a new room

export const addRoom = async (req , res ) => {
    try {
        const {
            roomType,
            hotel,
            pricePerNight,
            description,
            amenities,
            isAvailable,
        } = req.body;
const images = req.files?.map (file => file.filename);

const newRoom = await Room.create({
    roomType,
    hotel,
    pricePerNight,
    description,
    amenities,
    isAvailable,
    images: images,
}) ;

return res
     .status(201)
     .json({ message: "Room added successfully", success: true});

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// get all rooms for a specific owner

export const getOwnerRooms = async (req , res) => {
    try{
        const { id } = req.user;
        const rooms = await Room.find().populate({
            path: "hotel" ,
            match: { owner: id},
            select: "hotelName hotelAddress rating amenities",
        });
        const ownerRooms = rooms.filter((room) => room.hotel.owner === id);
        return res.status(200).json({ rooms, success: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error"});
    }
};

// get all rooms for users

export const getAllRooms = async (req,res) => {
    try {
        const rooms = await Room.find()
        .populate({
            path: "hotel",
            select: "hotelName hotelAddress amenities rating owner",
            populate: {
                path: "owner" ,
                select : "name email",
            },
        })
        .exec();

        res.json({ success: true, rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error"});
    }
};


// Delete a room
export const deleteRoom = async (req,res) =>{
    try{
        const {roomId} = req.params;
        
        const deletedRoom = await Room.findByIdAndDelete(roomId);

        if(!deletedRoom) {
            return res
            .status (404)
            .json({ success: false, message: "Room not found"});
        }
        res.json({success: true, message: "Room deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json ({message: "Internal server error"});
    }
};