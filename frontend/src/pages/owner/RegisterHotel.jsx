import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import {toast} from "react-hot-toast";
const RegisterHotel = () => {

const {axios,navigate}= useContext(AppContext);
  const [data, setData] = useState({
    hotelName: "",
    hotelDescription: "",
    rating: "",
    price: "",
    amenities: "",
    image: null,
  });

  const[file,setFile]=useState(null);
   const[preview,setPreview]=useState(null);


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

const handleImageChange=(e)=>{
    const selectedFile=e.target.files[0];
    setFile(selectedFile);
    setData({...data, image: selectedFile});
    if(selectedFile){
        const imageUrl=URL.createObjectURL(selectedFile);
        setPreview(imageUrl);
    }
};


const handleSubmit=async (e)=>{
    e.preventDefault();
    const formData= new FormData();
 formData.append("hotelName",data.hotelName);
 formData.append("hotelAddress",data.hotelAddress);
 formData.append("rating",data.rating);
 formData.append("price",data.price);
  formData.append("amenities",data.amenities);
 formData.append("image", file);
        
     try{
      const {data}= await axios.post("/api/hotel/register", formData);

      if (data.success) {
        toast.success(data.message);
        navigate("/owner");
      }else{
        toast.error(data.message);
      }
     } catch (error) {
         toast.error(error.message);
     }

};



  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form  onSubmit = {handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">

        {/* Image Upload */}
        <div>
          <p className="text-base font-medium">Hotel Image</p>
         
<div className="w-full my-4">
{/* hotel Image Preview */}


{preview &&(
    <div className="mb-3 flex justify-center">
        <img src={preview} alt=""  className="w-24 h-24 object-cover
        rounded shadow"/>
    </div>
)}
{/* file upload input */}
<input type="file" accept="image/*" onChange={handleImageChange}
className="block w-full text-sm text-gray-500
file:mr-4 file:py-2 file:px-4
file:rounded-full file:border-0
file:text-sm file:font-semibold
file:bg-blue-50 file:text-blue-700
hover:file:bg-blue-100 cursor-pointer"


/>


</div>

        </div>

        {/* 1. Hotel Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Hotel Name</label>
          <input
            type="text"
            name="hotelName"
            value={data.hotelName}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border"
          />
        </div>

        {/* 2. Hotel Address */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Hotel Address</label>
          <textarea
            name="hotelAddress"
            value={data.hotelAddress}
            onChange={handleChange}
            rows={4}
            className="outline-none py-2 px-3 rounded border resize-none"
          />
        </div>

        {/* 3. Rating */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Rating</label>
          <input
            type="number"
            name="rating"
            value={data.rating}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border"
          />
        </div>

        {/* 4. Price */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={handleChange}
            className="outline-none py-2 px-3 rounded border"
          />
        </div>

        {/* 5. Hotel Amenities */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Hotel Amenities</label>
          <textarea
            name="amenities"
            value={data.amenities}
            onChange={handleChange}
            rows={4}
            className="outline-none py-2 px-3 rounded border resize-none"
          />
        </div>

        <button className="px-8 py-2 bg-blue-500 text-white rounded">
          Register Hotel
        </button>

      </form>
    </div>
  );
};

export default RegisterHotel;
