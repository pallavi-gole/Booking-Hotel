import { Warehouse, CalendarArrowDown } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets";

const OwnerLayout = () => {

  const dashboardicon = (
    <svg
      className="w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
      />
    </svg>
  );

  const { owner, setOwner, axios, navigate } = useContext(AppContext);

  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: dashboardicon },
    { name: "Rooms", path: "/owner/rooms", icon: <Warehouse /> },
    { name: "Bookings", path: "/owner/bookings", icon: <CalendarArrowDown /> },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setOwner(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/owner">
          <img className="h-9" src={assets.logo} alt="logo" />
        </Link>

        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Owner</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="md:w-64 w-16 border-r h-[550px] pt-4 flex flex-col">
          {sidebarLinks.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="flex items-center py-3 px-4 gap-3 hover:bg-gray-100"
            >
              {item.icon}
              <p className="md:block hidden">{item.name}</p>
            </Link>
          ))}
        </div>

        <Outlet />
      </div>
    </>
  );
};

export default OwnerLayout;
