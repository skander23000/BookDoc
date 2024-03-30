"use client";
import { Button } from "@/components/ui/button";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRole } from "../_context/RoleContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Header() {
  const [role, setUserRole] = useState(null);
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    const handleUser = async () => {
      if (user) {
        const response = await GlobalApi.checkUserExists(user.email);
        const role = response.data[0].role.type;
        setUserRole(role);
        sessionStorage.setItem("role", role); // optionnel, pour la persistance du rôle
      }
    };

    handleUser().catch(console.error);
  }, [user]);
  const getRolePath = (role) => (role === "doctor" ? "/doctor-home" : "/");
  const handleLogout = () => {
    sessionStorage.removeItem("role");
  };
  const Menu = [
    {
      id: 1,
      name: "Home",
      path: getRolePath(role),
    },
  ];

  return (
    <div
      className="flex items-center 
    justify-between p-4 shadow-sm md:px-20"
    >
      <div className="flex items-center gap-10">
        <Image src="../logo2.png" alt="logo" width={180} height={80} />
        <ul className="md:flex gap-8 ">
          {Menu.map((item, index) => (
            <Link href={item.path} key={index}>
              <li
                className="hover:text-primary
                    cursor-pointer hover:scale-105
                    transition-all ease-in-out"
              >
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {user ? (
        <Popover>
          <PopoverTrigger>
            {user?.picture ? (
              <Image
                src={user?.picture}
                alt="profile-image"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <Image
                src={
                  "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                }
                alt="profile-image"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </PopoverTrigger>
          <PopoverContent className="w-44">
            <ul className="flex  flex-col gap-2">
              {role === "doctor" ? (
                <Link
                  href={"/edit-profile"}
                  className="cursor-pointer
             hover:bg-slate-100 p-2 rounded-md"
                >
                  Edit profile
                </Link>
              ) : (
                <Link
                  href={"/my-booking"}
                  className="cursor-pointer
           hover:bg-slate-100 p-2 rounded-md"
                >
                  My Booking
                </Link>
              )}
              <li
                className="cursor-pointer
             hover:bg-slate-100 p-2 rounded-md"
                onClick={handleLogout}
              >
                <LogoutLink> Logout </LogoutLink>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      ) : (
        <LoginLink>
          {" "}
          <Button>Get Started</Button>
        </LoginLink>
      )}
    </div>
  );
}

export default Header;
