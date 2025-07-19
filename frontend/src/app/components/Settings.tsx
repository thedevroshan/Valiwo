"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";

// stores
import { useAppStore } from "../stores/app-store";
import { useUserStore } from "../stores/user-store";

// Tabs
import ProfileTab from "../settings tabs/ProfileTab";
import AccountTab from "../settings tabs/AccountTab";
import PrivacyTab from "../settings tabs/PrivacyTab";

// Hooks
import { useDebounceAPI } from "../hooks/useDebounceAPI";

// API
import { UpdateProfileAPI } from "../api/profile.api";

const Settings = () => {
  // Type Definations & Enum
  enum ETabs {
    PROFILE = "profile",
    ACCOUNT = "account",
    PRIVACY = "privacy",
    SUBSCRIPTION_AND_MONETIZATION = "subscription_and_monetization",
    DEACTIVATION_AND_DELETION = "deactivation_and_deletion",
  }

  interface ITab {
    tabName: string;
    activeName: ETabs;
  }

  // app store values
  const isSettings = useAppStore((state) => state.isSettings);

  // app store function
  const setSettings = useAppStore((state) => state.setSettings);

  // user store values
  const profilePic = useUserStore((state) => state.profile_pic);

  // State
  const [currentActiveTab, setActiveTab] = useState<{
    activeTab: ETabs,
    tabName: string
  }>({activeTab: ETabs.PROFILE, tabName: "Profile"});


  const tabs: ITab[] = [
    {
      tabName: "Profile",
      activeName: ETabs.PROFILE,
    },
    {
      tabName: "Account",
      activeName: ETabs.ACCOUNT,
    },
    {
      tabName: "Privacy",
      activeName: ETabs.PRIVACY,
    },
    {
      tabName: "Subscription & Monetization",
      activeName: ETabs.SUBSCRIPTION_AND_MONETIZATION,
    },
    {
      tabName: "Deactivation & Deletion",
      activeName: ETabs.DEACTIVATION_AND_DELETION,
    },
  ];


  return (
    <>
      {isSettings && (
        <div className="w-[100vw] h-[100vh] absolute flex items-center justify-center bg-[#00000073]">
          <section className="absolute flex items-start justify-between select-none w-[90vw] h-[80vh] bg-primary border border-border z-10 rounded-2xl lg:h-[90vh] lg:w-[80vw] xl:w-[90vw]">
            {/* Navigation section */}
            <section className="w-[30%] flex flex-col h-full gap-2 px-2 py-2 xl:w-[25%]">
              <span className="text-white font-semibold text-2xl">
                Settings
              </span>

              <div className="w-full h-full flex flex-col gap-2">
                {tabs.map((tab) => (
                  <span
                    key={tab.tabName}
                    className={`${
                      currentActiveTab.activeTab == tab.activeName
                        ? "bg-white text-black"
                        : "hover:bg-white hover:text-black text-white"
                    } px-2 py-2 font-medium cursor-pointer rounded-lg transition-all duration-500`}
                    onClick={() => {
                      setActiveTab({...currentActiveTab, activeTab: tab.activeName, tabName: tab.tabName});
                    }}
                  >
                    {tab.tabName}
                  </span>
                ))}
              </div>

              <button
                className="bg-light-secondary w-full py-2 rounded-lg cursor-pointer hover:text-red-700 transition-all duration-500"
                onClick={() => {
                  setSettings(false);
                }}
              >
                Close
              </button>
            </section>

            {/* Settings Section */}
            <section className="py-3 w-[70%] xl:w-[75%] overflow-y-scroll h-full flex flex-col gap-3">
              <span className="font-bold text-3xl mb-4">{currentActiveTab.tabName}</span>

              {currentActiveTab.activeTab === ETabs.PROFILE && <ProfileTab/>}
              {currentActiveTab.activeTab === ETabs.ACCOUNT && <AccountTab/>}
              {currentActiveTab.activeTab === ETabs.PRIVACY && <PrivacyTab/>}
            </section>
          </section>
        </div>
      )}
    </>
  );
};

export default Settings;
