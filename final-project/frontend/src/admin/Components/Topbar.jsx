import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [adminName, setAdminName] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    const role = localStorage.getItem("adminRole");
    if (name) setAdminName(name);
    if (role) setAdminRole(role);
  }, []);

  return (
    <header className="flex items-center justify-between bg-[#eef3fb] p-4 rounded-tl-xl rounded-tr-xl border-b border-[#e6edf7]">
      {/* 🔍 Left Section */}
      <div className="flex items-center gap-4">
        <div className="bg-white rounded-full p-2 shadow-sm">
          <Search size={18} className="text-gray-600" />
        </div>
        <div className="text-sm text-gray-600">General Report</div>
      </div>

      {/* 🔔 Right Section */}
      <div className="flex items-center gap-4">


        <div 
          onClick={() => navigate("/admin/profile")}
          className="flex items-center gap-3 bg-white px-3 py-1 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=24" alt="admin" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-800">
              {adminName || "Admin"}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {adminRole || "Administrator"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
