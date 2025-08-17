"use client";
import React, { useState, useEffect, act } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// Stores
import { useUserStore } from "../stores/user-store";

// API
import { ChangeAccountTypeAPI } from "../api/account.api";

interface ISecurityTab {
  name: string;
  icon: string;
  activeName: ESecurityTabs;
}

enum ESecurityTabs {
  EMAIL = "email",
  PHONE = "phone",
  PASSWORD = "password",
  RECOVERY_EMAIL = "recovery_email",
  TWO_FACTOR_AUTHENTICATION = "two_factor_authentication",
  NONE = "none",
}

const AccountTab = () => {
  // Store values
  const user = useUserStore();
  const accountType = useUserStore((state) => state.account_type);

  // store func
  const setUser = useUserStore((state) => state.setUser);

  // states
  const [localAccountType, setAccountType] = useState<string>(accountType);
  const [activeSecurityTab, setActiveSecurityTab] = useState<ESecurityTabs>(
    ESecurityTabs.NONE
  );

  const SecurityTabs: ISecurityTab[] = [
    {
      name: "Email",
      icon: "/email-icon.png",
      activeName: ESecurityTabs.EMAIL,
    },
    {
      name: "Phone",
      icon: "/phone-icon.png",
      activeName: ESecurityTabs.PHONE,
    },
    {
      name: "Password",
      icon: "/password-icon.png",
      activeName: ESecurityTabs.PASSWORD,
    },
    {
      name: "Recovery Email",
      icon: "/email-icon.png",
      activeName: ESecurityTabs.RECOVERY_EMAIL,
    },
    {
      name: "Two-Factor Authencation",
      icon: "/two-factor-icon.png",
      activeName: ESecurityTabs.TWO_FACTOR_AUTHENTICATION,
    },
  ];

  // Mutations
  const changeAccountTypeMutation = useMutation({
    mutationFn: ChangeAccountTypeAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
        return;
      }
      setUser({ ...user, account_type: localAccountType });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error.response?.data);
      }
    },
  });

  useEffect(() => {
    setAccountType(accountType);
  }, [accountType]);

  return (
    <div className="w-full h-fit flex flex-col gap-3 px-2 py-2">
      {/* Security & Account Type */}
      <section className="flex flex-col xl:flex-row w-full h-fit gap-3">
        {/* Security */}
        <div className="w-full h-fit flex flex-col gap-2">
          <span className="font-semibold text-xl">Security</span>

          <div className="w-full h-[40vh] flex flex-col gap-1">
            {/* Main Security menu */}
            {activeSecurityTab == ESecurityTabs.NONE &&
              SecurityTabs.map((tab) => (
                <div
                  key={tab.name}
                  className="bg-light-secondary rounded-lg border border-border px-3 py-2 xl:py-2.5 flex gap-2 cursor-pointer items-center justify-between"
                  onClick={() => {
                    setActiveSecurityTab(tab.activeName);
                  }}
                >
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

              {/* Change email tab */}
            {activeSecurityTab == ESecurityTabs.EMAIL && (
              <div className="w-full flex flex-col h-[40vh] gap-3 items-start justify-start">
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="font-medium">Email</span>

                  <input
                    type="text"
                    className="border border-border px-2 py-2 rounded-lg w-[95%] outline-none bg-primary"
                  />
                </div>

                <button className="bg-primary-purple outline-none border-none w-[95%] hover:bg-primary-purple-hover rounded-lg py-2 cursor-pointer active:scale-95 transition-all duration-500">
                  Change Email
                </button>
                <button className="bg-light-secondary outline-none border-none w-[95%] hover:bg-light-secondary/55 rounded-lg py-2 cursor-pointer active:scale-95 transition-all duration-500" onClick={() => setActiveSecurityTab(ESecurityTabs.NONE)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Type */}
        <div className="w-full h-fit flex flex-col gap-2">
          <span className="font-semibold text-xl">Account Type</span>

          <div className="w-full px-2 py-2 rounded-xl bg-light-secondary flex items-center justify-between gap-2">
            <div
              className={`${
                localAccountType == "personal"
                  ? "bg-white text-black"
                  : "text-white"
              } flex items-center justify-center rounded-lg py-1 cursor-pointer w-full`}
              onClick={() => setAccountType("personal")}
            >
              <span className="font-extrabold text-2xl">Personal</span>
            </div>

            <div
              className={`${
                localAccountType == "creator"
                  ? "bg-white text-black"
                  : "text-white"
              } flex items-center justify-center rounded-lg py-1 cursor-pointer w-full`}
              onClick={() => setAccountType("creator")}
            >
              <span className="font-extrabold text-2xl">Creator</span>
            </div>
          </div>

          <button
            className={`transition-all duration-500 w-full rounded-lg py-2 font-medium outline-none border-none ${
              localAccountType == accountType
                ? "bg-primary-purple-hover/45 text-gray-600"
                : "bg-primary-purple hover:bg-primary-purple-hover cursor-pointer active:scale-95"
            }`}
            onClick={() => {
              if (localAccountType == accountType) return;
              changeAccountTypeMutation.mutate(localAccountType);
            }}
          >
            Switch
          </button>

          <span className="font-medium text-secondary-text">
            Personal account can be public or private. If it’s private only your
            followers can see and interact with posts, reels and stories and
            with you. Public account means everyone can interact with your
            posts, reels and stories and you as well. But still there is option
            to allow who can message you. Creator account can't be private.
          </span>
        </div>
      </section>

      {/* Login Activity */}
      <section className="w-full bg-light-secondary xl:mt-12 px-2 py-2 flex flex-col items-start justify-start rounded-xl gap-2">
        <span className="font-semibold text-xl">Login Activity</span>

        <div className="w-full flex gap-5 items-start justify-start flex-wrap">
          <div className="bg-primary rounded-xl flex flex-col gap-2 items-start justify-start px-4 py-3">
            <div className="flex gap-2">
              <Image
                src={"/phone-icon.png"}
                width={25}
                height={25}
                alt="Phone Icon"
              />
              <span className="font-medium">Vivo Y200 5G</span>
            </div>

            <span className="font-medium">178.65.233.86</span>
            <span className="font-medium">Kolkata, India</span>
            <span className="font-medium">15 August 2025 - 12:00 p.m.</span>

            <button className="px-6 py-1 rounded-md bg-red-800 hover:bg-red-900 transition-all duration-500 outline-none cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountTab;
