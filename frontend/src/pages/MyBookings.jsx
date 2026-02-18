import React, { useContext, useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext.jsx";

const MyBookings = () => {
  const { axios } = useContext(AppContext);
  const [bookingData, setBookingData] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBookingData(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePayment = async (bookingId) => {
    if (!bookingId) {
      toast.error("Booking ID missing");
      return;
    }

    try {
      console.log("sending bookingId:",bookingId);
      const { data } = await axios.post("/api/bookings/stripe-payment", {
        bookingId,
      });

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            My Booking
          </h1>
          <p className="text-gray-600 text-lg">
            Here are your hotel bookings. You can view details and manage your
            reservation.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {bookingData.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);

              return (
                <div
                  key={booking._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start md:items-center">
                    <div className="col-span-1 md:col-span-4">
                      <div className="flex gap-4">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/images/${
  booking.room?.images?.[0] || "default.png"
}`}

                          alt={booking.room?.roomType || "Room"}
                          className="w-20 h-16 md:w-24 md:h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-lg mb-1">
                            {booking.hotel?.hotelName || "Hotel not available"}
                          </h3>
                          <p className="text-blue-600 font-medium mb-1">
                            {booking.room?.roomType || "Room type N/A"}
                          </p>

                          <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                            <MapPin className="w-3 h-3" />
                            {booking.hotel?.hotelAddress || "Address not available"}
                          </div>

                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Users className="w-3 h-3" />
                            {booking.persons} Guest
                            {booking.persons > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <p className="font-bold text-lg text-gray-800">
                        ${booking.totalPrice}
                      </p>

                      {!booking.isPaid && (
                        <button
                          className="cursor-pointer"
                          onClick={() => handlePayment(booking._id)}
                        >
                          Pay Now
                        </button>
                      )}

                      {booking.isPaid && <p>Paid</p>}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        />
                        <StatusIcon
                          className={`w-4 h-4 ${getStatusTextColor(
                            booking.status
                          )}`}
                        />
                        {booking.status}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
