import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Users from "./Users";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import Groups from "./Groups";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success("Logout successful");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-[30%] min-h-[95%] my-4 ml-10 p-5 bg-white rounded-lg flex flex-col justify-between">
      <div>
        <SearchBar />
        <div className="flex flex-wrap gap-2 overflow-y-auto">
          <span
            className={`${
              activeTab === "All"
                ? "bg-cyan-900 text-white font-bold"
                : "text-gray-800 font-semibold"
            } text-sm rounded-lg px-4 py-[1px] cursor-pointer `}
            onClick={() => setActiveTab("All")}
          >
            All
          </span>
          <span
            className={`${
              activeTab === "Chats"
                ? "bg-emerald-900 text-white font-bold"
                : "text-gray-800 font-semibold"
            } text-sm rounded-lg px-4 py-[1px] cursor-pointer `}
            onClick={() => setActiveTab("Chats")}
          >
            Chats
          </span>
          <span
            className={`${
              activeTab === "Groups"
                ? "bg-slate-700 text-white font-bold"
                : "text-gray-800 font-semibold"
            } text-sm rounded-lg px-4 py-[1px] cursor-pointer `}
            onClick={() => setActiveTab("Groups")}
          >
            Groups
          </span>
        </div>
        {(activeTab === "All" || activeTab === "Chats") && <Users />}
        {activeTab === "All" && (<h1 className="m-2 text-md font-bold">Groups</h1>)}
        {(activeTab === "All" || activeTab === "Groups") && <Groups activeTab={activeTab} />}
      </div>
      <div className="flex">
        <Button
          className="p-2 m-2 bg-slate-900 text-white rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
