import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [hotelData, setHotelData] = useState([]);
  const [roomData, setRoomData] = useState([]);

  // Check if user is logged in
  const checkUserLoggedInOrNot = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user); // Backend se user info lena better hai
        if (data.user.role === "owner") {
          setOwner(data.user);
        }
      } else {
        setUser(false);
      }
    } catch (error) {
      console.log("Auth error:", error.response?.data || error.message);
      setUser(false);
    }
  };

  // Fetch all hotels (for admin/general view)
  const fetchHotelsData = async () => {
    try {
      const { data } = await axios.get("/api/hotel/get-all");
      if (data.success) {
        setHotelData(data.hotels);
      } else {
        toast.error(data.message || "Failed to fetch hotels");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch all rooms
  const fetchRoomsData = async () => {
    try {
      const { data } = await axios.get("/api/room/get-all");
      if (data.success) {
        setRoomData(data.rooms);
      } else {
        toast.error(data.message || "Failed to fetch rooms");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    checkUserLoggedInOrNot();
    fetchHotelsData();
    fetchRoomsData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        navigate,
        user,
        setUser,
        owner,
        setOwner,
        hotelData,
        roomData,
        setHotelData,
        setRoomData,
        axios,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
