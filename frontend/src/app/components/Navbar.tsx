"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useUserStore } from "../stores/user-store";

const Navbar = () => {
  const user = useUserStore();
  const profilePic = useUserStore((state) => state.profile_pic);
  const fullname = useUserStore((state) => state.fullname);
  const username = useUserStore((state) => state.username);

  return (
    <nav className="w-[90vw] h-[10vh] bg-secondary mx-auto mt-[88vh] border border-border rounded-xl px-1 flex items-center justify-between gap-10">
      <div className="flex items-center justify-between gap-12 px-3 w-[60vw]">
        <Link href={"/"} className="flex flex-col items-center">
          <Image src={"/home-icon.png"} width={25} height={25} alt="Home" />
          <span className="text-sm">Home</span>
        </Link>
        <Link href={"/explore"} className="flex flex-col items-center">
          <Image
            src={"/explore-icon.png"}
            width={25}
            height={25}
            alt="Explore"
          />
          <span className="text-sm">Explore</span>
        </Link>
        <Link href={"/reel"} className="flex flex-col items-center">
          <Image src={"/reel-icon.png"} width={25} height={25} alt="reel" />
          <span className="text-sm">Reels</span>
        </Link>
        <Link href={"/message"} className="flex flex-col items-center">
          <Image src={"/message-icon.png"} width={25} height={25} alt="reel" />
          <span className="text-sm">Message</span>
        </Link>

        <div className="flex flex-col items-center cursor-pointer select-none">
          <Image
            src={"/user-icon.png"}
            width={25}
            height={25}
            alt="Active User"
          />
          <span>Active User</span>
        </div>
      </div>

      <div className="flex items-center gap-2 select-none cursor-pointer bg-light-secondary hover:bg-primary transition-all duration-500 border border-border px-2 rounded-xl py-1">
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
    </nav>
  );
};

export default Navbar;
