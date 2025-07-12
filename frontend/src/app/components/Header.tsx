"use client";
import React from "react";
import Image from "next/image";

// Stores
import { useUserStore } from "../stores/user-store";

const Header = () => {
    const profilePic = useUserStore((state) => state.profile_pic)
    const fullname = useUserStore((state) => state.fullname)
    const username = useUserStore((state) => state.username)

  return (
    <section className="w-[90vw] lg:w-[78vw] lg:ml-[22vw] xl:w-[81vw] xl:ml-[19vw] lg:fixed h-[8vh] flex items-center justify-center lg:justify-start gap-12 lg:gap-2 lg:px-1 px-3 lg:h-[8vh] rounded-xl lg:mt-1 mt-2 select-none">
      <span className="font-semibold text-3xl lg:hidden">Valiwo</span>

      <input
        type="text"
        className="bg-secondary px-4 py-2 rounded-2xl outline-none w-[50vw] border border-border placeholder:text-secondary-text h-full text-lg"
        placeholder="Search"
      />

      <div className="flex items-center justify-between gap-2 w-fit h-full xl:w-[30vw]">
        <Image
          src="/notification-icon.png"
          width={25}
          height={25}
          alt="Notifications"
          className="cursor-pointer"
        />

        <div className="items-center gap-2 select-none cursor-pointer bg-light-secondary hover:bg-primary transition-all duration-500 border border-border px-2 py-0.5 rounded-2xl h-full hidden lg:flex w-[26vw]">
          <Image
            src={profilePic ? profilePic : "/user-icon.png"}
            height={40}
            width={40}
            alt="Profile Pic"
            className="rounded-full border border-border"
          />
          <div className="flex flex-col px-2">
            <span className="text-md">{fullname}</span>
            <span className="text-sm font-medium text-secondary-text">
              {username}
            </span>
          </div>
        </div>

        <div className="w-[12vw] flex items-center justify-center bg-secondary gap-4 h-full px-3 py-2 rounded-2xl border border-border cursor-pointer hover:bg-light-secondary transition-all duration-500">
          <Image src={"/create-icon.png"} width={20} height={20} alt="create" />
          <span className="font-medium">Create</span>
        </div>
      </div>
    </section>
  );
};

export default Header;
