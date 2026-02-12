import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";

// add a new room
export const addRoom = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { hotel, roomType, pricePerNight, description, amenities, isAvailable } = req.body;
    const images = req.files?.map(file => file.filename);

    const foundHotel = await Hotel.findOne({ _id: hotel, owner: ownerId });

    if (!foundHotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    const newRoom = await Room.create({
      hotel,
      roomType,
      pricePerNight,
      description,
      amenities,
      isAvailable,
      images,
    });

    res.status(201).json({ success: true, message: "Room added successfully", room: newRoom });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// get all rooms for a specific owner
export const getOwnerRooms = async (req , res) => {
  try {
    const ownerId = req.user.id; // owner id

    // Sab rooms leke aao jisme hotel.owner = ownerId
    const rooms = await Room.find()
      .populate({
        path: "hotel",
        select: "hotelName hotelAddress rating owner",
      });

    // filter rooms jisme hotel exists and hotel.owner match
    const ownerRooms = rooms.filter(
      (room) => room.hotel && room.hotel.owner.toString() === ownerId
    );

    return res.status(200).json({ success: true, rooms: ownerRooms });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
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