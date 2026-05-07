import React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export  function Header() {
  const navigate = useNavigate();
const userdata = Cookies.get("userdata")
  ? JSON.parse(Cookies.get("userdata"))
  : null;  const handleLogout = () => {
    Cookies.remove("accessToken");
        Cookies.remove("userdata");

    navigate("/login");
  }
  return (
      <header
      data-testid="app-header"
      className="border-b border-slate-200 bg-white relative"
    >
      <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center gap-10">
        <Link to="/timesheets" data-testid="brand-logo" className="flex items-center">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-[#000000]">ticktock</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            data-testid="nav-timesheets"
            to="/timesheets"
            className="text-slate-700 font-medium hover:text-slate-900 transition-colors"
          >
            Timesheets
          </Link>
        </nav>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger
              data-testid="user-menu-trigger"
              className="flex items-center gap-1.5 text-sm text-slate-700 hover:text-slate-900 outline-none"
            >
              <span data-testid="user-name">{userdata?.name ?? "John Doe"}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" data-testid="user-menu-content">
              <DropdownMenuItem disabled className="text-xs text-slate-500">
                {userdata?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="logout-button"
                onClick={handleLogout}
                className="text-red-600 focus:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
            
      </div>
    </header>
         
       
     
  );
}


export function Footer() {
  return (
    <footer className="rounded-lg bg-[#ffffff] mt-[1.907vh] flex items-center justify-center w-full h-[10.13vh] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
      <p className="text-center text-sm  text-[#6B7280]">
        © 2024 tentwenty. All rights reserved.
      </p>
    </footer>
  );
}