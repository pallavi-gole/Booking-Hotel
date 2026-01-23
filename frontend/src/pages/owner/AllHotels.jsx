import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { MapPin, Star } from "lucide-react";
import {toast} from "react-hot-toast";
import {motion} from "framer-motion";
import { useState } from 'react';
import { useEffect } from 'react';

const AllHotels = () => {
  const { navigate ,axios} = useContext(AppContext);

  const[hotelData, setHotelData] = useState([]);


  const fetchOwnerHotels=async()=>{
    try{
      const {data} = await axios.get("/api/hotel/get");
      if (data.success) {
        setHotelData(data.hotels);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
  toast.error(data.message);
    }
  }

  useEffect(() => {
    fetchOwnerHotels();
  }, []);


  const deleteHotel=async(id)=>{
    try{
      const {data} = await axios.delete(`/api/hotel/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchOwnerHotels();
      } else{
        toast.error(data.message);
      }
    } catch (error) {
toast.error(error.message);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      

      <div className="max-w-7xl mx-auto">
{/* Header */}
<div className="mb-8 flex flex-col md:flex-row justify-between
items-center bg-white rounded-2xl shadow-xl p-6">
<div>

<h1 className="text-4xl font-bold text-gray-800 mb-2"> 
  {" "}
  Premium Hotels Collection</h1>
<p className="text-gray-600">
  Discover exceptional stays around the world</p>
</div>

<motion.button 
className="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer"
 onClick={()=>navigate("/owner/register-hotel")}
whileHover={{ scale: 1.05}} 
transition={{ ease: "easeInOut",duration:0.3}}
>
  Register Hotel
</motion.button>

</div>


{/* HOtels table */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden">

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gradient-to-r from-blue-600 to-indigo-600
      text-white">
<tr>
<th className="px-6 py-4 text-left text-sm font-semibold uppercase
tracking-wider">
Hotel
</th>

<th className="px-6 py-4 text-left text-sm font-semibold uppercase
tracking-wider">
Location
</th>

<th className="px-6 py-4 text-left text-sm font-semibold uppercase
tracking-wider">
Hotel Owner
</th>

<th className="px-6 py-4 text-left text-sm font-semibold uppercase
tracking-wider">
Contact
</th>

<th className="px-6 py-4 text-left text-sm font-semibold uppercase
tracking-wider">
Rating 
</th>

<th className="px-6 py-4 text-left text-sm font-semibold uppercase
tracking-wider">
Price/Night
</th>

<th className="px-6 py-4 text-left text-sm font-semibold uppercase
tracking-wider">
Amenities
</th>

<th className="px-6 py-4 text-left text-sm font-semibold uppercase
tracking-wider">
Action
</th>


</tr>
      </thead>

<tbody className="divide-y divide-gray-100">

{hotelData?.map((hotel, index)=>(
  <tr key={hotel._id}
    className = {`hover:bg-blue-50 transition-all duration-200 ${
      index % 2 === 0 ? "bg-white" : "bg-gray-50"
    }`}
    >

      <td className="px-6 py-6">
        <div className="flex items-center space-x-4">
<div className="relative">
  <img src={`http://localhost:4000/images/${hotel.images}`}
  alt={hotel.hotelName} 
  className="w-20 h-16 rounded-xl object-cover shadow-md"
  />
<div className="absolute inset-0 bg-gradient-to-t from-black/22 to-transparent
 rounded-xl"></div>
</div>

<div>
  <h3 className="text-lg font-semibold text-gray-800
  hover:text-blue-600 transition-colors">{hotel.hotelName}</h3>
</div>
        </div>
      </td>

<td className="px-6 py-6">
<div className="flex  items-start space-x-2">

  <MapPin className= "w-4 h-4 text-gray-400 mt-1 flex-shrink-0"/>
  <span className="text-gray-600 text-sm leading-relaxed">
    {hotel.hotelAddress}
  </span>
</div>

</td>




<td className="px-6 py-6">
<div className="flex  items-start space-x-2">

  <span className="text-gray-600 text-sm leading-relaxed">
    {hotel.owner.name}
  </span>
</div>
</td>

<td className="px-6 py-6">
<div className="flex  items-start space-x-2">

  <span className="text-gray-600 text-sm leading-relaxed">
   +924782375
  </span>
</div>
</td>


<td className="px-6 py-6">
<div className="flex  items-start space-x-2">
<Star className="w-4 h-4 text-yellow-400 fill-current" />
  <span className="text-gray-600 text-sm leading-relaxed">
    {hotel.rating}
  </span>
</div>
</td>

<td className="px-6 py-6">
<span className="text-2xl font-bold text-green-600">
  ${hotel.price}</span>
</td>

<td className="px-6 py-6">
<div className="flex flex-wrap gap-1">
  {
    hotel.amenities.split(",").map((amenity,index) => (
      <span key={index}
      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-sm rounded-full "
      >
        {amenity}
      </span>
    ))
  }

</div>
</td>

<td>

  <button onClick={() => deleteHotel(hotel._id)} className="bg-red-500 text-white py-1 px-4 rounded-full
  cursor-pointer
  "> delete
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
  )
}

export default AllHotels;
