import React, { useContext, useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { axios, navigate } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/user/signup", formData, {

       
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <form
        onSubmit={submitHandler}
        className="max-w-96 w-full mx-auto mt-36 text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-heading text-3xl mt-10 font-medium">Signup</h1>
        <p className="text-paragraph text-sm mt-2">
          Please sign up to continue
        </p>

        {/* Name */}
        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <User size={18} className="text-gray-500" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChangeHandler}
            placeholder="Enter name"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
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

        {/* Role */}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <select
            name="role"
            value={formData.role}
            onChange={onChangeHandler}
            className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
            required
          >
            <option value="">Select your role</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        {/* Password */}
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

        {/* Button */}
        <button
          type="submit"
          className="w-full h-11 mt-6 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Signup
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-11">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500">
            Login Here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
