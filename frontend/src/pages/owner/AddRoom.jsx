import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AddRoom = () => {
  const { axios, navigate } = useContext(AppContext);

  const [roomData, setRoomData] = useState({
    hotel: "",
    roomType: "",
    pricePerNight: "",
    description: "",
    images: [],
    amenities: "",
    rating: "",
    isAvailable: true,
  });

  const [hotelData, setHotelData] = useState([]);

  // Fetch hotels of owner
  const fetchOwnerHotels = async () => {
    try {
      const { data } = await axios.get("/api/hotel/get");
      if (data.success) {
        setHotelData(data.hotels);
      } else {
        toast.error(data.message || "Failed to fetch hotels");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOwnerHotels();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData({
      ...roomData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image upload
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...roomData.images];
      updatedImages[index] = file;
      setRoomData({ ...roomData, images: updatedImages });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomData.hotel) {
      toast.error("Please select a hotel");
      return;
    }

    const formData = new FormData();
    formData.append("hotel", roomData.hotel);
    formData.append("roomType", roomData.roomType);
    formData.append("pricePerNight", roomData.pricePerNight);
    formData.append("description", roomData.description);
    formData.append("amenities", roomData.amenities);
    formData.append("isAvailable", roomData.isAvailable);

    // Append images safely
    for (let i = 0; i < roomData.images.length; i++) {
      if (roomData.images[i]) {
        formData.append("images", roomData.images[i]);
      }
    }

    try {
      const { data } = await axios.post("/api/room/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message || "Room added successfully");
        navigate("/owner/rooms");
      } else {
        toast.error(data.message || "Failed to add room");
      }
    } catch (error) {
      console.log("Room Add Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="py-10 bg-white">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {/* Images */}
        <div>
          <p className="text-base font-medium">Room Images</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    type="file"
                    accept="image/*"
                    id={`image${index}`}
                    hidden
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  <img
                    className="w-24 h-24 border rounded-md cursor-pointer object-cover"
                    src={
                      roomData.images[index]
                        ? URL.createObjectURL(roomData.images[index])
                        : "https://via.placeholder.com/100"
                    }
                    alt="upload"
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Room Type */}
        <div className="flex flex-col gap-1">
          <label>Room Type</label>
          <input
            type="text"
            name="roomType"
            value={roomData.roomType}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label>Room Description</label>
          <textarea
            name="description"
            value={roomData.description}
            onChange={handleChange}
            className="border px-3 py-2 rounded resize-none"
            required
          />
        </div>

        {/* Amenities */}
        <div className="flex flex-col gap-1">
          <label>Room Amenities</label>
          <textarea
            name="amenities"
            value={roomData.amenities}
            onChange={handleChange}
            className="border px-3 py-2 rounded resize-none"
          />
        </div>

        {/* Hotel Select */}
        <div className="flex flex-col gap-1">
          <label>Select Hotel</label>
          <select
            name="hotel"
            value={roomData.hotel}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          >
            <option value="">Select Hotel</option>
            {hotelData.map((item) => (
              <option key={item._id} value={item._id}>
                {item.hotelName}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <label>Price Per Night</label>
          <input
            type="number"
            name="pricePerNight"
            value={roomData.pricePerNight}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Availability */}
        <label className="flex items-center gap-2">
          <span>isAvailable</span>
          <input
            type="checkbox"
            name="isAvailable"
            checked={roomData.isAvailable}
            onChange={handleChange}
          />
        </label>

        {/* Submit */}
        <button className="bg-blue-500 text-white px-6 py-2 rounded">
          Add New Room
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
