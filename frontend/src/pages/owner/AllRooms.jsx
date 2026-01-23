import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import {toast} from "react-hot-toast";

const AllRooms = () => {
  const {  navigate,axios } = useContext(AppContext);


  const[roomData, setRoomData] = useState([]);

  const fetchOwnerRooms= async()=>{
try {
 const {data} =await axios.get("/api/room/get");
 if(data.success) {
  setRoomData(data.rooms);
 } else{
  toast.error(data.message);
 }
} catch (error) {
toast.error(error.message);
}
  };
useEffect(() => {
  fetchOwnerRooms();
}, []);


const deleteRoom= async(id)=>{
  try{
    const {data} = await axios.delete("/api/room/delete/"+ id);
    if(data.success){
      toast.success(data.message);
      fetchOwnerRooms();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
toast.error(error.message);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-xl p-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Your All Rooms
            </h1>
            <p className="text-gray-600">Manage your rooms here</p>
          </div>

          <motion.button
            className="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer"
            onClick={() => navigate("/owner/add-room")}
            whileHover={{ scale: 1.05 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          >
            Add New Room
          </motion.button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Hotel</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Room Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price/Night</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amenities</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {roomData?.map((room, index) => (
                  <tr
                    key={room?._id}
                    className={`hover:bg-blue-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {/* Hotel */}
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`http://localhost:4000/images/${room.images[0]}`}
                          alt={room?.roomType}
                          className="w-20 h-16 rounded-xl object-cover shadow-md"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {room?.hotelName}
                        </h3>
                      </div>
                    </td>

                    {/* Room Type */}
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{room?.roomType}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-6 text-sm text-gray-600">
                      {room?.hotel?.hotelAddress}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-6 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {room?.hotel?.rating}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-6 flex items-center gap-1">
                      
                      <span>${room?.pricePerNight}</span>
                    </td>

                    {/* Amenities */}
                    <td className="px-6 py-6">
                      <div className="flex flex-wrap gap-1">
                        {room?.amenities?.split(",").map((amenity, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-6">
                      <button onClick={() => deleteRoom(room._id)} 
                      className="bg-red-500 text-white px-4 py-1 rounded-full">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
