import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RoomCard from '../components/RoomCard';

const HotelDetail = () => {
  const { id } = useParams(); // hotel id
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
      const res = await axios.get(`/api/hotel/${id}`);


        console.log(res.data);
        setHotel(res.data.hotel);
        setRooms(res.data.rooms); // rooms of this hotel
      } catch (err) {
        console.error(err);
      }
    };
    fetchHotel();
  }, [id]);

  if (!hotel) return <div className="py-24 text-center">Loading...</div>;

  return (
    <div className="py-24 max-w-7xl mx-auto">
      {/* Hotel Info */}
      <div className="mb-12 text-center">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/images/${hotel.image}`}

          alt={hotel.hotelName}
          className="w-full max-w-3xl h-72 object-cover mx-auto rounded-lg"
        />
        <h1 className="text-3xl font-semibold mt-6">{hotel.hotelName}</h1>
        <p className="text-gray-600">{hotel.hotelAddress}</p>
        <p className="mt-2 text-gray-700">Amenities: {hotel.amenities}</p>
        <p className="mt-2 font-medium text-lg">Price: ${hotel.price}</p>
      </div>

      {/* Rooms */}
      <h2 className="text-2xl font-semibold mb-6 text-center">Available Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {rooms?.map((room) => (
          <div
            key={room._id}
            onClick={() => navigate(`/room/${room._id}`)}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
          >
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelDetail;
