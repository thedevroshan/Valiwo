"use client";
import React from "react";
import Image from "next/image";

interface ISecurityTab {
  name: string;
  icon: string;
}

const AccountTab = () => {
  const SecurityTabs: ISecurityTab[] = [
    {
      name: "Email",
      icon: "/email-icon.png",
    },
    {
      name: "Phone",
      icon: "/phone-icon.png",
    },
    {
      name: "Password",
      icon: "/password-icon.png",
    },
    {
      name: "Recovery Email",
      icon: "/email-icon.png",
    },
    {
      name: "Two-Factor Authencation",
      icon: "/two-factor-icon.png",
    },
  ];

  return (
    <div className="w-full h-fit flex flex-col gap-3 px-2 py-2">
      {/* Security & Account Type */}
      <section className="flex flex-col xl:flex-row w-full h-fit gap-3">
        {/* Security */}
        <div className="w-full h-fit flex flex-col gap-2">
          <span className="font-semibold text-xl">Security</span>

          <div className="w-full h-fit flex flex-col gap-1">
            {SecurityTabs.map((tab) => (
              <div key={tab.name} className="bg-light-secondary rounded-lg border border-border px-3 py-2 xl:py-2.5 flex gap-2 cursor-pointer items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={tab.icon}
                    width={25}
                    height={25}
                    alt={tab.icon}
                  />

                  <span className="font-medium">{tab.name}</span>
                </div>

                <Image
                  src={"/arrow-icon.png"}
                  width={20}
                  height={20}
                  alt="arrow-icon"
                  className="rotate-180 opacity-15"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Account Type */}
        <div className="w-full h-fit flex flex-col gap-2">
          <span className="font-semibold text-xl">Account Type</span>

          <div className="w-full px-2 py-2 rounded-xl bg-light-secondary flex items-center justify-between gap-2">
            <div className="bg-white flex items-center justify-center rounded-lg py-1 cursor-pointer w-full">
              <span className="text-black font-extrabold text-2xl">Personal</span>
            </div>

            <div className="flex items-center justify-center rounded-lg py-1 cursor-pointer w-full">
              <span className="text-white font-extrabold text-2xl">Creator</span>
            </div>
          </div>

          <button className="bg-primary-purple hover:bg-primary-purple-hover transition-all duration-500 w-full rounded-lg py-2 cursor-pointer font-medium">Switch</button>

          <span className="font-medium text-secondary-text">Personal account can be public or private. If it’s private only your followers can see and interact with posts, reels and stories and with you. Public account means everyone can interact with your posts, reels and stories and you as well. But still there is option to allow who can message you.</span>
        </div>
      </section>

      {/* Login Activity */}
      <section className="w-full bg-light-secondary xl:mt-12 px-2 py-2 flex flex-col items-start justify-start rounded-xl gap-2">
        <span className="font-semibold text-xl">Login Activity</span>


        <div className="w-full flex gap-5 items-start justify-start flex-wrap">
          <div className="bg-primary rounded-xl flex flex-col gap-2 items-start justify-start px-4 py-3">
            <div className="flex gap-2">
              <Image
              src={'/phone-icon.png'}
              width={25}
              height={25}
              alt="Phone Icon"
              />
              <span className="font-medium">Vivo Y200 5G</span>
            </div>

            <span className="font-medium">178.65.233.86</span>
            <span className="font-medium">Kolkata, India</span>
            <span className="font-medium">15 August 2025 - 12:00 p.m.</span>

            <button className="px-6 py-1 rounded-md bg-red-800 hover:bg-red-900 transition-all duration-500 outline-none cursor-pointer">Logout</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountTab;
