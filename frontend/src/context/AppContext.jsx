import {  createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {hotelsData, roomsData} from "../assets/assets.js";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL= "http://localhost:4000";

export const AppContext= createContext();

const AppContextProvider = ({ children })=> {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const[owner, setOwner] = useState(null);
    const[hotelData,setHotelData]= useState([]);
    const[roomData,setRoomData]= useState([]);



const checkUserLoggedInOrNot= async()=>{
    try{
const {data}= await axios.get("/api/user/is-auth");
if (data.success) {
    setUser (true);
} 
    
    }
    catch (error){
console.log("error", error);
    }
};
    const fetchHotelsData= async ()=>{
      try{
      const {data} = await axios.get("/api/hotel/get-all");
      if (data.success) {
        setHotelData(data.hotels);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
  toast.error(data.message);
    }
    };
 const fetchRoomsData= async()=>{
       try {
 const {data} =await axios.get("/api/room/get-all");
 if(data.success) {
  setRoomData(data.rooms);
 } else{
  toast.error(data.message);
 }
} catch (error) {
toast.error(error.message);
}
    };


useEffect(()=>{
    checkUserLoggedInOrNot();
    fetchHotelsData();
    fetchRoomsData();
},[]);
const value = {navigate ,user,setUser,owner,setOwner,hotelData,roomData,roomsData: roomData,axios,};
   

return (
<AppContext.Provider value={value}>{children}</AppContext.Provider>
);
};

export default AppContextProvider;
