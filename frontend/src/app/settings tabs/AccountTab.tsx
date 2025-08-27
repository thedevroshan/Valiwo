"use client";
import React, { useState, useEffect, act } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// Stores
import { useUserStore } from "../stores/user-store";

// API
import {
  ChangeAccountTypeAPI,
  ChangeEmailAPI,
  ChangePasswordAPI,
  ChangePhoneAPI,
  ChangeRecoveryEmailAPI,
  ChangeTwoFacOptionAPI,
  ToggleTwoFactorAuthenticationAPI,
} from "../api/account.api";

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

enum ETWOFACTORAUTHOTPION {
  EMAIL = "email",
  SMS = "sms",
  BOTH = "both",
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
  const [securityTabInfo, setSecurityTabInfo] = useState<{
    email: string;
    phone: string;
    current_password: string;
    new_password: string;
    confirm_password: string;
    recovery_email: string;
    two_factor_auth: boolean;
    two_factor_auth_option: ETWOFACTORAUTHOTPION;
    is_password: boolean;
    show_password: boolean;
  }>({
    email: user.email,
    phone: user.phone ? user.phone : "",
    current_password: "",
    new_password: "",
    confirm_password: "",
    recovery_email: user.recovery_email,
    two_factor_auth: user.is_two_factor_auth,
    two_factor_auth_option: user.two_factor_auth_option as ETWOFACTORAUTHOTPION || ETWOFACTORAUTHOTPION.NONE,
    is_password: false,
    show_password: false,
  });

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

  const changeEmailMutation = useMutation({
    mutationFn: ChangeEmailAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
        return;
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error?.response?.data);
      }
    },
  });

  const changePhoneMutation = useMutation({
    mutationFn: ChangePhoneAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
        return;
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error?.response?.data);
      }
    },
  });

  const changeRecoveryEmailMutation = useMutation({
    mutationFn: ChangeRecoveryEmailAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
        return;
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error?.response?.data);
      }
    },
  });

  const toggleTwoFactAuthMutation = useMutation({
    mutationFn: ToggleTwoFactorAuthenticationAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
        return;
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error?.response?.data);
      }
    },
  });

  const changeTwoFacOptionMutation = useMutation({
    mutationFn: ChangeTwoFacOptionAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
        return;
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error?.response?.data);
      }
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ChangePasswordAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
        return;
      }
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error?.response?.data);
      }
    },
  });

  useEffect(() => {
    setAccountType(accountType);
    setSecurityTabInfo({
      email: user.email,
      phone: user.phone ? user.phone : "",
      current_password: "",
      new_password: "",
      confirm_password: "",
      recovery_email: user.recovery_email,
      two_factor_auth: user.is_two_factor_auth,
      two_factor_auth_option:
        user.two_factor_auth_option as ETWOFACTORAUTHOTPION,
      is_password: false,
      show_password: false,
    });
  }, [user, user.is_two_factor_auth]);

  // Passord Validation
  useEffect(() => {
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
        securityTabInfo.new_password
      ) &&
      securityTabInfo.new_password === securityTabInfo.confirm_password
    ) {
      setSecurityTabInfo({
        ...securityTabInfo,
        is_password: true,
      });
    } else {
      setSecurityTabInfo({
        ...securityTabInfo,
        is_password: false,
      });
    }
  }, [securityTabInfo.confirm_password, securityTabInfo.new_password]);

  return (
    <div className="w-full h-fit flex flex-col gap-3 px-2 py-2">
      {/* Security & Account Type */}
      <section className="flex flex-col xl:flex-row w-full h-fit gap-3 xl:gap-12">
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
              <div className="w-full flex flex-col h-[40vh] gap-3 items-center justify-start">
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="font-medium">Email</span>

                  <input
                    type="text"
                    className="border border-border px-2 py-2 rounded-lg w-full outline-none bg-primary"
                    value={securityTabInfo?.email}
                    onChange={(e) => {
                      setSecurityTabInfo({
                        ...securityTabInfo,
                        email: e.target.value,
                      });
                    }}
                  />
                  {changeEmailMutation.isSuccess && (
                    <span className="font-medium text-secondary-text text-center">
                      We have sent you a email verification link. Check your
                      inbox
                    </span>
                  )}
                </div>

                <button
                  className={`${
                    securityTabInfo.email == user.email ||
                    changeEmailMutation.isPending
                      ? "text-gray-300 bg-primary-purple/45"
                      : "bg-primary-purple hover:bg-primary-purple-hover active:scale-95 cursor-pointer text-white"
                  } outline-none border-none w-full rounded-lg py-2 transition-all duration-500`}
                  onClick={() => {
                    if (
                      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                        securityTabInfo.email
                      ) ||
                      securityTabInfo.email == user.email
                    )
                      return;

                    changeEmailMutation.mutate(securityTabInfo.email);
                    setUser({
                      ...user,
                      email: securityTabInfo.email,
                    });
                  }}
                >
                  {changeEmailMutation.isPending ? "Wait..." : "Change Email"}
                </button>
                <button
                  className="bg-light-secondary outline-none border-none w-full hover:bg-light-secondary/55 rounded-lg py-2 cursor-pointer active:scale-95 transition-all duration-500"
                  onClick={() => setActiveSecurityTab(ESecurityTabs.NONE)}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Change phone number tab */}
            {activeSecurityTab == ESecurityTabs.PHONE && (
              <div className="w-full flex flex-col h-[40vh] gap-3 items-center justify-start">
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="font-medium">Phone</span>

                  <input
                    type="text"
                    className="border border-border px-2 py-2 rounded-lg w-full outline-none bg-primary"
                    value={securityTabInfo?.phone}
                    onChange={(e) => {
                      setSecurityTabInfo({
                        ...securityTabInfo,
                        phone: e.target.value,
                      });
                    }}
                  />
                </div>

                <button
                  className={`${
                    securityTabInfo.phone ==
                      (user.phone == null ? "" : user.phone) ||
                    changePhoneMutation.isPending
                      ? "text-gray-300 bg-primary-purple/45"
                      : "bg-primary-purple hover:bg-primary-purple-hover active:scale-95 cursor-pointer text-white"
                  } outline-none border-none w-full rounded-lg py-2 transition-all duration-500`}
                  onClick={() => {
                    if (
                      securityTabInfo.phone ==
                      (user.phone == null ? "" : user.phone)
                    )
                      return;

                    changePhoneMutation.mutate(securityTabInfo.phone);
                    setUser({
                      ...user,
                      phone: securityTabInfo.phone,
                    });
                  }}
                >
                  {changePhoneMutation.isPending ? "Wait..." : "Change Phone"}
                </button>
                <button
                  className="bg-light-secondary outline-none border-none w-full hover:bg-light-secondary/55 rounded-lg py-2 cursor-pointer active:scale-95 transition-all duration-500"
                  onClick={() => setActiveSecurityTab(ESecurityTabs.NONE)}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Change password tab */}
            {activeSecurityTab == ESecurityTabs.PASSWORD && (
              <div className="w-full flex flex-col h-[40vh] gap-3 items-center justify-start">
                <div className="flex flex-col items-start justify-center w-full gap-2">
                  <div className="flex flex-col items-start justify-center w-full">
                    <span className="font-medium">Current Password</span>
                    <input
                      type={securityTabInfo.show_password ? "text" : "password"}
                      className="border border-border px-2 py-2 rounded-lg w-full outline-none bg-primary"
                      value={securityTabInfo?.current_password}
                      onChange={(e) =>
                        setSecurityTabInfo({
                          ...securityTabInfo,
                          current_password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center w-full">
                    <span className="font-medium">New Password</span>
                    <input
                      type={securityTabInfo.show_password ? "text" : "password"}
                      className="border border-border px-2 py-2 rounded-lg w-full outline-none bg-primary"
                      value={securityTabInfo?.new_password}
                      onChange={(e) =>
                        setSecurityTabInfo({
                          ...securityTabInfo,
                          new_password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center w-full">
                    <span className="font-medium">Confirm Password</span>
                    <input
                      type={securityTabInfo.show_password ? "text" : "password"}
                      className="border border-border px-2 py-2 rounded-lg w-full outline-none bg-primary"
                      value={securityTabInfo?.confirm_password}
                      onChange={(e) =>
                        setSecurityTabInfo({
                          ...securityTabInfo,
                          confirm_password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    className="ml-auto cursor-pointer"
                    onClick={() =>
                      setSecurityTabInfo({
                        ...securityTabInfo,
                        show_password: !securityTabInfo.show_password,
                      })
                    }
                  >
                    {securityTabInfo.show_password
                      ? "Hide Password"
                      : "Show Password"}
                  </button>
                </div>

                <button
                  className={`${
                    !securityTabInfo.is_password ||
                    changePasswordMutation.isPending ||
                    changePasswordMutation.isSuccess
                      ? " bg-primary-purple/45 text-gray-300"
                      : "bg-primary-purple hover:bg-primary-purple-hover cursor-pointer active:scale-95"
                  } outline-none border-none w-full rounded-lg py-2 transition-all duration-500`}
                  disabled={changePasswordMutation.isPending}
                  onClick={() => {
                    if (
                      !securityTabInfo.current_password ||
                      !securityTabInfo.new_password
                    )
                      return;

                    changePasswordMutation.mutate({
                      current_password: securityTabInfo.current_password,
                      new_password: securityTabInfo.new_password,
                      confirm_password: securityTabInfo.confirm_password,
                    });
                  }}
                >
                  {changePasswordMutation.isPending
                    ? "Wait..."
                    : "Change Password"}
                </button>
                <button
                  className="bg-light-secondary outline-none border-none w-full hover:bg-light-secondary/55 rounded-lg py-2 cursor-pointer active:scale-95 transition-all duration-500"
                  onClick={() => setActiveSecurityTab(ESecurityTabs.NONE)}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* change recovery email tab */}
            {activeSecurityTab == ESecurityTabs.RECOVERY_EMAIL && (
              <div className="w-full flex flex-col h-[40vh] gap-3 items-center justify-start">
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="font-medium">Recovery Email</span>

                  <input
                    type="text"
                    className="border border-border px-2 py-2 rounded-lg w-full outline-none bg-primary"
                    value={securityTabInfo?.recovery_email}
                    onChange={(e) =>
                      setSecurityTabInfo({
                        ...securityTabInfo,
                        recovery_email: e.target.value,
                      })
                    }
                  />

                  {changeRecoveryEmailMutation.isSuccess && (
                    <span className="font-medium text-secondary-text">
                      We have sent you a email verification link. Check your
                      inbox.
                    </span>
                  )}
                </div>

                <button
                  className={`${
                    securityTabInfo.recovery_email == user.recovery_email ||
                    changeRecoveryEmailMutation.isPending
                      ? "text-gray-300 bg-primary-purple/45"
                      : "bg-primary-purple hover:bg-primary-purple-hover active:scale-95 cursor-pointer text-white"
                  } outline-none border-none w-full rounded-lg py-2 transition-all duration-500`}
                  onClick={() => {
                    if (
                      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                        securityTabInfo.recovery_email
                      ) ||
                      securityTabInfo.recovery_email == user.recovery_email
                    )
                      return;

                    changeRecoveryEmailMutation.mutate(
                      securityTabInfo.recovery_email
                    );
                    setUser({
                      ...user,
                      recovery_email: securityTabInfo.recovery_email,
                    });
                  }}
                >
                  {changeRecoveryEmailMutation.isPending
                    ? "Wait..."
                    : "Change Recovery Email"}
                </button>
                <button
                  className="bg-light-secondary outline-none border-none w-full hover:bg-light-secondary/55 rounded-lg py-2 cursor-pointer active:scale-95 transition-all duration-500"
                  onClick={() => setActiveSecurityTab(ESecurityTabs.NONE)}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* change two factor authenctiaction */}
            {activeSecurityTab == ESecurityTabs.TWO_FACTOR_AUTHENTICATION && (
              <div className="w-full flex flex-col h-[40vh] gap-3 items-center justify-start">
                <div className="flex flex-col items-start justify-center w-full gap-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">Two Factor Authencation</span>
                    <div
                      className={`${
                        securityTabInfo.two_factor_auth
                          ? "bg-primary-purple"
                          : "bg-light-secondary"
                      } rounded-full w-12 h-4 cursor-pointer`}
                      onClick={() => {
                        toggleTwoFactAuthMutation.mutate();
                        setUser({
                          ...user,
                          is_two_factor_auth: !securityTabInfo.two_factor_auth,
                        });
                      }}
                    ></div>
                  </div>

                  {securityTabInfo.two_factor_auth && (
                    <div className="bg-light-secondary rounded-lg w-full flex items-center justify-between px-2 py-2 gap-1">
                      <button
                        className={`${
                          securityTabInfo?.two_factor_auth_option ==
                          ETWOFACTORAUTHOTPION.EMAIL
                            ? "bg-white text-black"
                            : "text-white"
                        } rounded-lg w-full py-2 font-semibold cursor-pointer outline-none border-none`}
                        onClick={() => {
                          setSecurityTabInfo({
                            ...securityTabInfo,
                            two_factor_auth_option: ETWOFACTORAUTHOTPION.EMAIL,
                          });

                          changeTwoFacOptionMutation.mutate(
                            ETWOFACTORAUTHOTPION.EMAIL
                          );
                        }}
                      >
                        EMAIL
                      </button>
                      <button
                        className={`${
                          securityTabInfo?.two_factor_auth_option ==
                          ETWOFACTORAUTHOTPION.SMS
                            ? "bg-white text-black"
                            : "text-white"
                        } rounded-lg w-full py-2 font-semibold cursor-pointer outline-none border-none`}
                        onClick={() => {
                          setSecurityTabInfo({
                            ...securityTabInfo,
                            two_factor_auth_option: ETWOFACTORAUTHOTPION.SMS,
                          });

                          changeTwoFacOptionMutation.mutate(
                            ETWOFACTORAUTHOTPION.SMS
                          );
                        }}
                      >
                        SMS
                      </button>
                      <button
                        className={`${
                          securityTabInfo?.two_factor_auth_option ==
                          ETWOFACTORAUTHOTPION.BOTH
                            ? "bg-white text-black"
                            : "text-white"
                        } rounded-lg w-full py-2 font-semibold cursor-pointer outline-none border-none`}
                        onClick={() => {
                          setSecurityTabInfo({
                            ...securityTabInfo,
                            two_factor_auth_option: ETWOFACTORAUTHOTPION.BOTH,
                          });

                          changeTwoFacOptionMutation.mutate(
                            ETWOFACTORAUTHOTPION.BOTH
                          );
                        }}
                      >
                        BOTH
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className="bg-light-secondary outline-none border-none w-full hover:bg-light-secondary/55 rounded-lg py-2 cursor-pointer active:scale-95 transition-all duration-500"
                  onClick={() => setActiveSecurityTab(ESecurityTabs.NONE)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Type */}
        <div className="w-full h-fit flex flex-col gap-2 mt-12">
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
