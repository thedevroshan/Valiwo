"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useUserStore } from "../stores/user-store";

const Navbar = () => {
  // Type Definations
  type NavLink = {
    icon: string;
    path: string;
    link_name: string;
  };

  const profilePic = useUserStore((state) => state.profile_pic);
  const fullname = useUserStore((state) => state.fullname);
  const username = useUserStore((state) => state.username);

  const navLinks: NavLink[] = [
    {
      icon: "/home-icon.png",
      path: "/",
      link_name: "Home",
    },
    {
      icon: "/explore-icon.png",
      path: "/explore",
      link_name: "Explore",
    },
    {
      icon: "/reel-icon.png",
      path: "/reel",
      link_name: "Reel",
    },
    {
      icon: "/message-icon.png",
      path: "/message",
      link_name: "Message",
    },
    {
      icon: "/saved-icon.png",
      path: "/saved",
      link_name: "Saved",
    },
    {
      icon: "/liked-history-icon.png",
      path: "/liked",
      link_name: "Liked",
    },
    {
      icon: "/archive-icon.png",
      path: "/archive",
      link_name: "Archive",
    },
  ];

  return (
    <nav className="w-[90vw] h-[10vh] bg-secondary border border-border rounded-xl px-1 flex items-center justify-between gap-10 lg:gap-2 fixed lg:relative mt-[88vh] lg:mt-[0vh] lg:rounded-none lg:py-3 lg:px-3 lg:border-l-0 lg:border-b-0 lg:border-t-0 lg:flex-col lg:items-start lg:justify-start lg:w-[22vw] lg:h-[100vh] xl:w-[19vw] select-none">
      <span className="text-3xl font-semibold hidden lg:block select-none">
        Valiwo
      </span>

      <div className="flex items-center justify-between gap-12 lg:gap-1 px-3 lg:px-0 w-[60vw] lg:w-full lg:flex-col lg:items-start lg:h-fit">
        {navLinks.map((link, index) => {
          if (index <= 3) {
            return (
              <Link
                key={link.path}
                href={link.path}
                className="flex flex-col items-center lg:flex-row lg:items-center lg:hover:bg-light-secondary lg:w-full lg:gap-2 lg:px-2 lg:py-2 lg:rounded-xl transition-all duration-400 lg:hover:font-medium"
              >
                <Image
                  src={link.icon}
                  width={25}
                  height={25}
                  alt={link.link_name}
                  className="lg:w-5"
                />
                <span className="text-sm">{link.link_name}</span>
              </Link>
            );
          }
        })}

        <div className="flex flex-col items-center cursor-pointer select-none lg:flex-row lg:hidden">
          <Image
            src={"/user-icon.png"}
            width={25}
            height={25}
            alt="Active User"
          />
          <span>Active User</span>
        </div>
      </div>

      <div className="flex items-center gap-2 select-none cursor-pointer bg-light-secondary hover:bg-primary transition-all duration-500 border border-border px-2 rounded-xl py-1 lg:hidden">
        <Image
          src={profilePic ? profilePic : "/user-icon.png"}
          height={45}
          width={45}
          alt="Profile Pic"
          className="rounded-full border border-border"
        />
        <div className="flex flex-col px-2">
          <span className="font-semibold">{fullname}</span>
          <span className="text-sm font-medium text-secondary-text">
            {username}
          </span>
        </div>
      </div>

      <div className="w-full h-1 bg-light-secondary rounded-full hidden lg:block"></div>

      <div className="hidden lg:gap-1 lg:flex lg:flex-col lg:items-start w-full">
        {navLinks.map((link, index) => {
          if (index > 3) {
            return (
              <Link
                key={link.path}
                href={link.path}
                className="flex flex-col items-center lg:flex-row lg:items-center lg:w-full lg:gap-2 lg:px-2 lg:py-2 lg:rounded-xl lg:hover:bg-light-secondary transition-all duration-500 lg:hover:font-medium"
              >
                <Image
                  src={link.icon}
                  width={25}
                  height={25}
                  alt={link.link_name}
                  className="lg:w-5"
                />
                <span className="text-sm">{link.link_name}</span>
              </Link>
            );
          }
        })}
      </div>

      <div className="w-full h-1 bg-light-secondary rounded-full lg:block hidden"></div>

      <div className="w-full h-[32vh] hidden lg:flex lg:flex-col">
        <span className="text-secondary-text font-semibold select-none">Active Users</span>

        <div className="w-full h-full flex flex-col">

        </div>
      </div>

      <div className="w-full h-fit hover:font-medium hover:bg-light-secondary rounded-xl hidden py-2 px-2 gap-2 cursor-pointer lg:flex transition-all duration-300">
        <Image
        src={'/menu-icon.png'}
        width={20}
        height={20}
        alt="Menu"
        />

        <span>More</span>
      </div>
    </nav>
  );
};

export default Navbar;
