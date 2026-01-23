import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import RoomCard from './RoomCard';

const PopularRooms = () => {
    const {roomsData} = useContext(AppContext)
  return (
    <div className="py-12">
      <h1 className='text-heading text-3xl font-semibold text-center mx-auto'>
        Popular Rooms
      </h1>

      <p className='text-paragraph text-sm text-center max-w-lg mx-auto'>
        Explore our top-rated room loved by guests for comfort and location.
      </p>


    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 
    max-w-7xl mx-auto mt-12">

{roomsData?.map ((room)=> (
    <RoomCard key={room._id} room={room} />
)

)}
    </div>




    </div>
  )
}

export default PopularRooms;
