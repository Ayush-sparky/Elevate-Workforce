import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { NavLink, Outlet } from "react-router-dom";
import { House, ShieldUser, BriefcaseBusiness, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className=" h-screen flex text-amber-50">
      <div className=" flex flex-col justify-between items-center p-4 w-1/4 h-full bg-blue-950 ">
        <h1 className=" font-extrabold text-3xl flex justify-center items-center h-1/8">Elevate Workforce</h1>
        <ul className=" h-3/5 w-full flex flex-col justify-center gap-8 border-y-2">
          <li>
            <NavLink
            end
              className={({ isActive }) =>
                `text-xl flex gap-4 items-center p-4 rounded-xl ${
                  isActive ? "bg-blue-800" : "hover:bg-blue-900"
                }`
              }
              to="/admin-dashboard"
            >
              Home <House />
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                `text-xl flex gap-4 items-center p-4 rounded-xl ${
                  isActive ? "bg-blue-800" : "hover:bg-blue-900"
                }`
              }
              to="/admin-dashboard/jobs"
            >
              Jobs <BriefcaseBusiness size={20} />
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                `text-xl flex gap-4 items-center p-4 rounded-xl ${
                  isActive ? "bg-blue-800" : "hover:bg-blue-900"
                }`
              }
              to="/admin-dashboard/users"
            >
              Users <ShieldUser size={20} />
            </NavLink>
          </li>
        </ul>
        <div className=" h-1/5 flex w-full items-center">
          <button
            className=" flex items-center gap-4 p-4 text-xl cursor-pointer text-gray-300 hover:text-gray-50"
            onClick={logout}
          >
            Logout <LogOut size={20} />
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
