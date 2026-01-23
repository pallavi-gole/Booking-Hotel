import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.js";

import stripe from "stripe";
// function to check Availability of room

export const checkAvailability = async ({ room, checkInDate, checkOutDate,}) => {
    try {
        const booking = await Booking.find({

            room,
            checkIn: { $lte: checkOutDate},
            checkOut: {$gte: checkInDate},
        });

        const isAvailable = booking.length === 0;
        return isAvailable;
    } catch (error) {
        console.log (("error", error));

        
    }
};




// api to check Availability of Room
// post 

export const checkRoomAvailability = async (req, res) => {
    try{ 
        const {room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({
            room,
            checkInDate,
            checkOutDate,
        });

        res.json({ success: true, isAvailable});
    } catch (error) {
        res.status(500).json({ message: "Internal server error"});
    }
};


// api to book a room

export const bookRoom = async (req,res) => {
    try{
        const {id} = req.user;

        const user = await User.findById(id);
        const {room, checkInDate, checkOutDate, persons, paymentMethod } = req.body;

        
        // before booking check availability
        const isAvailable = await checkAvailability({
            room,
            checkInDate,
            checkOutDate,
        });
        if(!isAvailable){
     return res.status(400).json({ messge: "Room is not available" , success: false})
        }


        // get total price for room


        const roomData = await Room.findById(room).populate("hotel");
       
        let totalPrice = roomData.pricePerNight;


// calculate totalprice based on per night

const checkIn= new Date(checkInDate);
const checkOut= new Date(checkOutDate);
const timeDiff= checkOut.getTime() - checkIn.getTime();
const nights = Math.ceil(timeDiff /(1000* 3600 *24));
totalPrice = totalPrice * nights * persons;


const booking = await Booking.create({
    user: id,
    room,
    hotel: roomData.hotel._id,
    checkIn,
    checkOut,
    persons,
    totalPrice,
    paymentMethod,
});

const mailOptions={
    from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:"Room Booked Successfully",
    html:`
    <h1>Hotel Booking Confirmation</h1>

    <p>Dear ${user.name},</p>
    <p> Thank you for booking with us. Your booking details are as follows:
    </p>
    <ul>
    <li>Booking ID: ${booking._id}</li>
    <li>Hotel: ${roomData.hotel.hotelName}</li>
     <li>Room Type: ${roomData.roomType}</li>
      <li>Check-in Date: ${checkInDate}</li>
       <li>Check-out Date: ${checkOutDate}</li>
        <li>Number of Persons: ${persons}</li>
         <li>Total Price: ${process.env.CURRENCY || "$"} ${totalPrice}</li>
    </ul>
    `,
};

 await transporter.sendMail(mailOptions);



   res.json({ success: true, message: "Room Booked Successfully"});
    } catch (error) {
        res.status(500) .json({ message: "Internal server error"});
    }
};



// api to get all booking for a User

export const getUserBookings = async (req, res) => {
    try{
        const { id } = req.user;
        const bookings = await Booking.find({ user: id })
        .populate("hotel room")
        .sort({ createdAt: -1});
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500) .json ({ message: "Internal server error" });
    }
};


// api to get all booking for a hotel

export const getHotelBookings = async (req, res) => {
    try{
        const { id } = req.user;
        
        const hotels = await Hotel.find({ owner: id}). select("_id");
        if(!hotels) {
            return res.status(404).json({ message: "Hotels not found", success: false});

        }

        const hotelsId = hotels.map((hotel) => hotel._id);

        const bookings = await Booking.find({ hotel: { $in: hotelsId } })
        .populate("room hotel")
        .sort({ createdAt: -1 });
        if (bookings.length === 0) {
            return res
            .status(404)
            .json({message: "Bookings not found", success: false });
        } else {

                res.json({ success: true, bookings });
        }

    
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// payment


export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId);
    console.log("Booking:", booking);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.room) {
      return res.status(400).json({ message: "Room not linked to booking" });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");
    console.log("Room Data:", roomData);

    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }

    const totalPrice = booking.totalPrice;
    const origin = req.headers.origin || "http://localhost:5173";

    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.hotel?.hotelName || "Hotel Room",
          },
          unit_amount: totalPrice ? totalPrice * 100 : 0,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: { bookingId },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log("Stripe Payment Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


