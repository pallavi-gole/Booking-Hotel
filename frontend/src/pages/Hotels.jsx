import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Hotels = () => {
  const { hotelData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className='py-24 max-w-7xl mx-auto'>
      <h1 className='text-3xl font-semibold text-heading my-8 px-2 text-center'>
        All Hotels
      </h1>

      <div className="flex flex-wrap items-center justify-center mt-12 gap-4 max-w-5xl mx-auto">
        {hotelData.map((item, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden cursor-pointer"
            onClick={() => navigate(`/hotel/${item._id}`)}
          >
            <img
              src={`http://localhost:4000/images/${item.image}`}
              alt={item.hotelName}
              className="w-56 h-56 object-cover object-top"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-4
              text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h1 className="text-lg font-medium">{item.hotelName}</h1>
              <p className="text-sm">{item.hotelAddress}</p>
              <h1 className="text-lg font-medium">${item.price}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
