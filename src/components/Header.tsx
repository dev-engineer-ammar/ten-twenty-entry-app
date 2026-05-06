// import { Link } from "react-router-dom";

// export function Header() {
//   return (
    // <header className=" w-full bg-[#ffffff] overflow-hidden">
    //   <div className="w-full flex h-[8.1vh] items-center justify-between">
    //     <div className="flex items-center gap-x-[1.02vw] ">
    //       <div className="text-[1.535vw] flex items-center justify-center font-bold tracking-tight w-[7.5vw]">
    //         ticktock
    //       </div>

    //       <div className="flex items-center justify-between w-[90vw] gap-x-[1.02vw] ">

    //         <div
    //           className="text-[0.8957vw] font-medium text-foreground/80 hover:text-foreground"
    //           //   activeProps={{ className: "text-foreground" }}
    //           >
    //           Timesheets
    //         </div>
      
    //     <div className=" text-[0.8957vw] font-medium">
    //       John Doe
    //       {/* <ChevronDown className="h-4 w-4" /> */}
    //     </div>
    //     </div>
    //           </div>
    //   </div>
    // </header>
//   );
// }


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
     <header className=" w-full bg-[#ffffff] overflow-hidden">
      <div className="w-full flex h-[8.1vh] items-center justify-between">
        <div className="flex items-center gap-x-[1.02vw] ">
          <div className="text-[1.535vw] flex items-center justify-center font-bold tracking-tight w-[7.5vw]">
            ticktock
          </div>

          <div className="flex items-center justify-between w-[90vw] gap-x-[1.02vw] ">

            <div
              className="text-[0.8957vw] font-medium text-foreground/80 hover:text-foreground"
              //   activeProps={{ className: "text-foreground" }}
              >
              Timesheets
            </div>
      
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
              </div>
      </div>
    </header>
         
       
     
  );
}


export function Footer() {
  return (
    <footer className="rounded-lg bg-[#ffffff] mt-[1.907vh] flex items-center justify-center w-full h-[10.13vh] shadow-[0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]">
      <p className="text-center text-[0.8957vw] text-[#6B7280]">
        © 2024 tentwenty. All rights reserved.
      </p>
    </footer>
  );
}