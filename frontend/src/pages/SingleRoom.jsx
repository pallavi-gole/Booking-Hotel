import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast'; 
import {
  Eye,
  MapPin,
  Star,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Phone,
  User,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Bath,
  Utensils,
  Mountain,
  Building,
  TreePine,
} from 'lucide-react';

const SingleRoom = () => {
  const { roomsData , axios, navigate} = useContext(AppContext);
  const { id } = useParams();

  const room = roomsData?.find((r) => r._id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    persons: 1,
  });

  const [isAvailable, setIsAvailable] = useState(false);
  const onChangeHandler = (e) => {
    setBookingData ({ ...bookingData, [e.target.name]: e.target.value});
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Ocean View": Eye,
      "Mountain View": Mountain,
      "City View": Building,
      "Garden View": TreePine,
      "Balcony": Building,
      "Mini Bar": Coffee,
      "Room Service": Utensils,
      "Free Wifi": Wifi,
      "Premium Wifi": Wifi,
      "Work Desk": Building,
      "Concierge Service": User,
      "Breakfast Included": Coffee,
      "Parking": Car,
      "Smart Tv": Tv,
      "Spa Access": Bath,
      "Pool Access": Bath,
      "Kitchen": Utensils,
      "Living Area": Building,
      "Private Terrace": Building,
      "Butler Service": User,
      "Jacuzzi": Bath,
      "Panoramic View": Eye,
    };

    return iconMap[amenity] || CheckCircle;
  };


const checkRoomAvailability= async()=>{
  try {
    
if(bookingData.checkIn >= bookingData.checkOut){
  toast.error ("Check-in date should be before check-out date");
  return;
}

const {data} = await axios.post("/api/bookings/check-availability", {

  room: room._id,
  checkInDate: bookingData.checkIn,
  checkOutDate: bookingData.checkOut,
});
if (data.success) {
  if (data.isAvailable) {
    setIsAvailable(true);
    toast.success ("Room is available");
  } else{
    setIsAvailable(false);
    toast.error("Room is not available");
  }
} else{
  toast.error(data.message);
}

  } catch (error) {
    toast.error(error.message);
  }
};

const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    if(!isAvailable){
        return checkRoomAvailability();
    
    } else{
      const { data } = await axios.post("/api/bookings/book", {
        room: room._id,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        persons: bookingData.persons,
        paymentMethod: "Pay At Hotel",
      });
      if(data.success) {
        toast.success(data.message);
        navigate("/my-bookings")
        scrollTo(0,0);
      } else {
        toast.error(data.message);
      }
    }
    
  } catch (error) {
    toast.error(error.message);
    
  }
};

  
  return (
    <div className="py-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800">
                {room?.roomType}
              </h1>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{room?.hotel?.hotelAddress}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>{room?.hotel?.rating}</span>
                </div>

                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    room?.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room?.isAvailable ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Available
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Not Available
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${room?.pricePerNight} <span>/night</span>
              </div>

              <div className="text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{room?.hotel?.owner?.name}</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  <span>+56676766</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Room Gallery
          </h2>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <img
                src={`http://localhost:4000/images/${room?.images?.[selectedImage]}`}
                alt={`${room?.roomType} - Image ${selectedImage + 1}`}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {room?.images?.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:4000/images/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`h-24 lg:h-20 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedImage === index
                      ? "ring-4 ring-blue-500 opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About This Room
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {room?.description}
              </p>
            </div>

            {/* Room Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Hotel Amenities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room?.amenities?.split(",").map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* hotel Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Room Amenities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room?.hotel?.amenities?.split(",").map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>


{/* Booking Form */}
<div className="lg:col-span-1">
    <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Book This Room
        </h2>
<form onSubmit={onSubmitHandler} className="space-y-4">
<div>
    <label
    htmlFor=""
    className="block text-sm font-medium text-gray-700 mb-2"
    >
        <Calendar className="w-4 h-4 inline mr-2" />
        check-in Date
    </label>
<input type="date"
name= "checkIn"
min={new Date(). toISOString().split("T") [0]}
value={bookingData.checkIn}
onChange={onChangeHandler}
className="w-full px-4 py-3 border border-gray-300 rounded-lg
focus:ring-2 focus:ring-blue-500 focus:border-transparent"
 />
</div>
<div>
    <label
    htmlFor=""
    className="block text-sm font-medium text-gray-700 mb-2"
    >
        <Calendar className="w-4 h-4 inline mr-2" />
        check-out Date
    </label>
<input type="date"
name= "checkOut"
value={bookingData.checkOut}
min= {bookingData.checkIn}
onChange={onChangeHandler}
className="w-full px-4 py-3 border border-gray-300 rounded-lg
focus:ring-2 focus:ring-blue-500 focus:border-transparent"
 />
</div>
<div>
    <label
    htmlFor=""
    className="block text-sm font-medium text-gray-700 mb-2"
    >
        <User className="w-4 h-4 inline mr-2" />
       Number of Guests
    </label>
<input type="number"
min="1"
value={bookingData.persons}
name= "persons"
onChange={onChangeHandler}
className="w-full px-4 py-3 border border-gray-300 rounded-lg
focus:ring-2 focus:ring-blue-500 focus:border-transparent"
 />
</div>


<div className="border-t pt-4 mt-6">
    <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Price per night</span>
<span className="text-xl font-bold">
    ${room.pricePerNight}
</span>
    </div>
</div>

<button 
className={`w-full py-3 px-6 rounded-lg font-medium transition-all
    duration-200 bg-blue-600 hover:bg-blue-700 text-white
 
   ` }
type="submit" 
 
  >
    {isAvailable ? "Book Now" : "Check Availability"}
    </button>



</form>

    </div>


</div>

        </div>

      </div>
    </div>
  );
};

export default SingleRoom;
