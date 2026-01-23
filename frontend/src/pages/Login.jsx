import React, {useContext, useState} from 'react'
import { Mail, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import toast from "react-hot-toast";
const Login = () => {


const{setUser,navigate , setOwner, axios}=useContext(AppContext);
  const[formData,setFormData]= useState({
    email:"",
    password: "",
  });

  const onChangeHandler=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const submitHandler =async(e)=>{
    e.preventDefault();
   try {
const {data} = await axios.post("/api/user/login",formData);

if(data.success){
  toast.success(data.message);
  if(data.user.role==="owner"){
    setOwner(true);
    navigate("/owner")
  } else {
    setUser(true);
    navigate("/");
  }

} else {
  toast.error(data.message);
}

   } catch (error) {
    toast.error(error.response.data.message);
   }
  };
  return (
    <div>
      <form onSubmit={submitHandler} 
      className="max-w-96 w-full mx-auto mt-36 text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        
        <h1 className="text-heading text-3xl mt-10 font-medium">Login</h1>
        <p className="text-paragraph text-sm mt-2">Please sign in to continue</p>

        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={18} className="text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            placeholder="Email id"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={18} className="text-gray-500" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
            placeholder="Password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Login
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-11">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-indigo-500">
            Sign up
          </Link>
        </p>

      </form>
    </div>
  )
}

export default Login
