"use client";
import React, { ChangeEvent } from "react";
import Image from "next/image";
import { useState, useRef } from "react";
import { isAxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Stores
import { useUserStore, IUserStore } from "../stores/user-store";

// Components
import ProfileLink from "./components/ProfileLink";
import Song from "./components/Song";
import FollowerAndFollowing from "./components/FollowerAndFollowing";

// Hooks
import { useDebounceAPI } from "../hooks/useDebounceAPI";

// API
import {
  AddLinkAPI,
  GetProfileLinksAPI,
  UpdateProfileAPI,
  RemoveProfilePicAPI,
  ChangeProfilePicAPI,
} from "../api/profile.api";
import { GetFollowersAPI, GetFollowingAPI } from "../api/follow.api";

const ProfileTab = () => {
  // user store values
  const user = useUserStore();
  const profilePic = useUserStore((state) => state.profile_pic);
  const fullname = useUserStore((state) => state.fullname);
  const username = useUserStore((state) => state.username);
  const bio = useUserStore((state) => state.bio);
  const gender = useUserStore((state) => state.gender);
  const isPrivate = useUserStore((state) => state.is_private);

  // user store function
  const setUser = useUserStore((state) => state.setUser);

  // States
  const [profileLink, setProfileLink] = useState<{
    title: string;
    link: string;
    error: string;
  }>({ title: "", link: "", error: "" });
  const [isFollower, setFollower] = useState<boolean>(true);
  const [isUploadProfilePic, setUploadProfilePic] = useState<boolean>(false);
  const [profilePicAdjustmentsSettings, setProfilePicAdjustmentsSettings] =
    useState<{
      positionX: number;
      positionY: number;
      zoom: number;
    }>({
      positionX: 0,
      positionY: 0,
      zoom: 1,
    });
  const [newProfilePicSelected, setNewProfilePicSelected] =
    useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newProfilePicRef = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Hooks
  const { debounceMutate, mutationError } = useDebounceAPI(
    UpdateProfileAPI,
    800
  );
  const queryClient = useQueryClient();

  // Mutation
  const addLinkMutation = useMutation({
    mutationFn: AddLinkAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        setProfileLink({ ...profileLink, error: data.msg });
      }
      setProfileLink({ title: "", link: "", error: "" });
      queryClient.invalidateQueries({ queryKey: ["profile-link"] });
      setUser({ ...user, links: [...user.links, { ...data.data }] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        setProfileLink({ ...profileLink, error: error.response?.data.msg });
        console.log(error.response?.data);
      }
    },
  });

  const removeProfilePicMutation = useMutation({
    mutationFn: RemoveProfilePicAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
      }
      setUser({ ...user, profile_pic: "" });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error.response?.data);
      }
    },
  });

  const changeProfilePicMutation = useMutation({
    mutationFn: ChangeProfilePicAPI,
    onSuccess: (data) => {
      if (!data.ok) {
        // Toast
        return;
      }
      setUser({ ...user, profile_pic: data?.data });
      setUploadProfilePic(false);
      newProfilePicRef.current = null;
      setNewProfilePicSelected(false);
      setProfilePicAdjustmentsSettings({
        positionX: 0,
        positionY: 0,
        zoom: 1,
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Toast
        console.log(error.response?.data);
      }
    },
  });

  // Query
  const profileLinkQuery = useQuery({
    queryKey: ["profile-link"],
    queryFn: GetProfileLinksAPI,
  });

  const followersListQuery = useQuery({
    queryKey: ["followers-list"],
    queryFn: () => GetFollowersAPI({ username }),
  });

  const followingListQuery = useQuery({
    queryKey: ["following-list"],
    queryFn: () => GetFollowingAPI({ username }),
  });

  useEffect(() => {
    if (
      profileLinkQuery.data?.data ||
      followersListQuery.data?.data ||
      followingListQuery.data?.data
    ) {
      setUser({
        ...user,
        links: profileLinkQuery.data?.data,
        followers: followersListQuery.data?.data,
        following: followingListQuery.data?.data,
      });
    }
  }, [
    profileLinkQuery?.data?.data,
    followersListQuery?.data?.data,
    followingListQuery?.data?.data,
  ]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasContextRef.current = canvasRef.current.getContext("2d");
      DrawProfilePic();
    }
  }, [newProfilePicRef.current, profilePicAdjustmentsSettings]);

  const DrawProfilePic = () => {
    if (
      canvasContextRef.current &&
      canvasRef.current &&
      newProfilePicRef.current
    ) {
      const img = new window.Image();
      img.onload = () => {
        const canvasImgWidth =
          (img.width / (img.width + img.height)) *
          (canvasRef?.current?.width as number);
        const canvasImgHeight =
          (img.height / (img.width + img.height)) *
          (canvasRef?.current?.height as number);

        canvasContextRef.current?.clearRect(
          0,
          0,
          canvasRef.current?.width as number,
          canvasRef.current?.height as number
        );
        canvasContextRef.current?.drawImage(
          img,
          (canvasRef.current?.width as number) / 2 -
            (canvasImgWidth * profilePicAdjustmentsSettings.zoom) / 2 +
            ((canvasRef.current?.width as number) / 100) *
              profilePicAdjustmentsSettings.positionX,
          (canvasRef.current?.height as number) / 2 -
            (canvasImgHeight * profilePicAdjustmentsSettings.zoom) / 2 +
            ((canvasRef.current?.height as number) / 100) *
              profilePicAdjustmentsSettings.positionY,
          canvasImgWidth * profilePicAdjustmentsSettings.zoom,
          canvasImgHeight * profilePicAdjustmentsSettings.zoom
        );
      };

      img.src = URL.createObjectURL(
        new Blob([newProfilePicRef.current as BlobPart], { type: "image/*" })
      );
    }
  };

  const rAFId = requestAnimationFrame(() => DrawProfilePic());

  return (
    <div className="w-full h-fit flex flex-col items-center justify-start xl:items-start xl:justify-center gap-4 px-3 mb-2 xl:flex-row">
      <section className="w-full flex flex-col gap-2 items-center justify-start xl:w-[50%]">
        {/* Profile Pic Section */}
        <div className="w-full flex items-center justify-center gap-6">
          <Image
            src={profilePic ? profilePic : "/user-icon.png"}
            width={170}
            height={170}
            alt="Profile Pic"
            className="rounded-full border-4 border-border"
          />

          <div className="flex flex-col gap-2">
            <button
              className="bg-primary-purple hover:bg-primary-purple-hover rounded-lg cursor-pointer px-12 py-2 transition-all duration-500"
              onClick={() => setUploadProfilePic(true)}
            >
              Upload new
            </button>
            <button
              className="bg-light-secondary hover:bg-light-secondary/70 rounded-lg cursor-pointer px-12 py-2 transition-all duration-500"
              onClick={() => {
                removeProfilePicMutation.mutate();
              }}
            >
              Remove
            </button>
          </div>

          {isUploadProfilePic && (
            <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
              <div className="w-[90%] h-[90%] lg:w-[75%] xl:w-[65%] px-2 py-2 rounded-xl bg-primary border border-border flex items-center justify-start gap-2">
                {/* Image Preview section */}
                <canvas
                  width={500}
                  height={500}
                  className={`bg-light-secondary rounded-xl ${
                    !newProfilePicSelected ? "hidden" : "block"
                  }`}
                  ref={canvasRef}
                ></canvas>

                {!newProfilePicSelected && (
                  <div
                    className="w-[65%] h-full bg-light-secondary/30 border-2 border-border border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image
                      src={"/img-icon.png"}
                      width={100}
                      height={100}
                      alt="No Image"
                    />
                    <span className="font-medium text-lg">
                      No Image Selected
                    </span>

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      className="w-full h-full hidden"
                      ref={fileInputRef}
                      onChange={() => {
                        const file = fileInputRef.current?.files?.[0];
                        if (file) {
                          const fileReader = new FileReader();
                          fileReader.onload = (e) => {
                            if (e.target?.result) {
                              const arrayBuffer = e.target
                                .result as ArrayBuffer;
                              newProfilePicRef.current = new Uint8Array(
                                arrayBuffer
                              );
                              setNewProfilePicSelected(true);
                            }
                          };
                          fileReader.readAsArrayBuffer(file);
                        }
                      }}
                    />
                  </div>
                )}

                {/* Adjustments */}
                <div className="w-[35%] h-full flex flex-col items-start justify-start gap-3">
                  <span className="font-medium text-xl">Adjustments</span>

                  {/* Zoom */}
                  <div className="w-full flex flex-col items-start justify-center gap-1">
                    <span className="text-medium">Zoom</span>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      disabled={!newProfilePicSelected}
                      value={profilePicAdjustmentsSettings.zoom}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProfilePicAdjustmentsSettings({
                          ...profilePicAdjustmentsSettings,
                          zoom: parseInt(e.target.value),
                        });
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Left - Right */}
                  <div className="w-full flex flex-col items-start justify-center gap-1">
                    <span className="text-medium">Left - Right</span>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      disabled={!newProfilePicSelected}
                      value={profilePicAdjustmentsSettings.positionX}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProfilePicAdjustmentsSettings({
                          ...profilePicAdjustmentsSettings,
                          positionX: parseInt(e.target.value),
                        });
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Up - Down */}
                  <div className="w-full flex flex-col items-start justify-center gap-1">
                    <span className="text-medium">Up - Down</span>
                    <input
                      type="range"
                      min={-100}
                      max={100}
                      disabled={!newProfilePicSelected}
                      value={profilePicAdjustmentsSettings.positionY}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProfilePicAdjustmentsSettings({
                          ...profilePicAdjustmentsSettings,
                          positionY: parseInt(e.target.value),
                        });
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="w-full h-fit flex flex-col items-center justify-center gap-2 mt-4">
                    <button
                      className={`w-full bg-primary-purple hover:bg-primary-purple-hover transition-all duration-500 py-2 rounded-lg cursor-pointer outline-none border-none ${
                        changeProfilePicMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={changeProfilePicMutation.isPending}
                      onClick={() => {
                        canvasContextRef.current?.canvas.toBlob(
                          async (blob) => {
                            if (!blob) return;

                            const arrayBuffer = await blob.arrayBuffer();
                            const fileBinary = new Uint8Array(arrayBuffer);
                            changeProfilePicMutation.mutate(fileBinary);
                          }
                        );
                      }}
                    >
                      {changeProfilePicMutation.isPending
                        ? "Wait..."
                        : "Upload"}
                    </button>

                    <button
                      className="w-full bg-light-secondary hover:bg-red-800 transition-all duration-500 py-2 rounded-lg cursor-pointer outline-none border-none"
                      onClick={() => {
                        setUploadProfilePic(false);
                        newProfilePicRef.current = null;
                        setNewProfilePicSelected(false);
                        setProfilePicAdjustmentsSettings({
                          positionX: 0,
                          positionY: 0,
                          zoom: 1,
                        });
                        cancelAnimationFrame(rAFId);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User details section */}
        <div className="w-full flex items-start justify-center gap-3 flex-col">
          {/* Full name */}
          <div className="flex flex-col w-full items-start justify-center gap-1">
            <label htmlFor="full-name" className="font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="full-name"
              className="w-full bg-light-secondary px-3 py-2 text-lg outline-none border-none rounded-lg"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUser({ ...user, fullname: e.target.value });
                debounceMutate({
                  field: "fullname",
                  fieldValue: e.target.value,
                });
              }}
              value={fullname}
            />
          </div>

          {/* Username */}
          <div className="flex flex-col w-full items-start justify-center gap-1">
            <label htmlFor="user-name" className="font-medium">
              Username
            </label>
            <input
              type="text"
              id="user-name"
              className="w-full bg-light-secondary px-3 py-2 text-lg outline-none border-none rounded-lg"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUser({ ...user, username: e.target.value });
                debounceMutate({
                  field: "username",
                  fieldValue: e.target.value,
                });
              }}
              value={username}
            />
            <span className="text-secondary-text font-medium">
              You can get back to your previous username anytime within 14 days.
            </span>
          </div>

          {/* Bio */}
          <div className="flex flex-col w-full items-start justify-center gap-1">
            <label htmlFor="bio" className="font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              className="w-full bg-light-secondary px-3 py-2 text-lg outline-none border-none rounded-lg resize-none"
              rows={5}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setUser({ ...user, bio: e.target.value });
                debounceMutate({ field: "bio", fieldValue: e.target.value });
              }}
              value={bio}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col w-full items-start justify-center gap-1">
            <label htmlFor="gender" className="font-medium">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className="bg-light-secondary px-3 py-2 text-lg outline-none border-none w-full rounded-lg"
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setUser({ ...user, gender: e.target.value });
                debounceMutate({ field: "gender", fieldValue: e.target.value });
              }}
              value={typeof gender === "string" ? gender : ""}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Birthday */}
          <div className="flex flex-col w-full items-start justify-center gap-1">
            <label htmlFor="birthday" className="font-medium">
              Birthday
            </label>
            <input
              type="date"
              className="bg-light-secondary px-3 py-2 w-full rounded-lg outline-none border-none text-lg"
            />
          </div>

          {/* Profile Visibility */}
          <div className="flex flex-col w-full items-start justify-center gap-1">
            <label htmlFor="profile-visibility" className="font-medium">
              Profile Visibility
            </label>
            {
              <span className="text-red-800 text-sm hidden">
                {"Error Message"}
              </span>
            }
            <select
              name="profile-visibility"
              id="profile-visibility"
              className="bg-light-secondary px-3 py-2 outline-none border-none rounded-lg w-full text-lg"
              value={isPrivate ? "private" : "public"}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setUser({
                  ...user,
                  is_private: e.target.value == "private" ? true : false,
                });
                debounceMutate({
                  field: "is_private",
                  fieldValue: e.target.value == "private" ? true : false,
                });
              }}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          {/* Link section */}
          <div className="bg-light-secondary w-full rounded-lg py-2 flex flex-col items-center gap-2 h-[60vh]">
            <div className="w-full px-2 gap-2 flex flex-col">
              <div className="flex items-center justify-center gap-1">
                <input
                  type="text"
                  className="bg-primary outline-none px-2 py-1 rounded-lg border border-border placeholder:text-secondary-text w-full"
                  placeholder="Link"
                  value={profileLink.link}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setProfileLink({ ...profileLink, link: e.target.value });
                  }}
                />
                <input
                  type="text"
                  className="bg-primary outline-none px-2 py-1 rounded-lg border border-border placeholder:text-secondary-text w-full"
                  placeholder="Title"
                  value={profileLink.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setProfileLink({ ...profileLink, title: e.target.value });
                  }}
                />
              </div>
              {profileLink.error && (
                <span className="font-medium text-sm text-red-800">
                  {profileLink.error}
                </span>
              )}
              <button
                className="w-full rounded-md cursor-pointer py-1 bg-primary-purple hover:bg-primary-purple-hover transition-all duration-500"
                onClick={() => {
                  if (!profileLink.title || !profileLink.link) return;
                  addLinkMutation.mutate({
                    title: profileLink.title,
                    link: profileLink.link,
                  });
                }}
              >
                Add Link
              </button>
            </div>

            <div className="w-full h-full flex flex-col overflow-y-scroll px-2 py-2 gap-1">
              {profileLinkQuery.isLoading && (
                <span className="m-auto animate-pulse font-medium">
                  Fetching Links....
                </span>
              )}
              {user.links &&
                user.links?.map(
                  (link: { _id: string; title: string; link: string }) => (
                    <ProfileLink
                      key={link._id}
                      title={link.title}
                      link={link.link}
                      linkId={link._id}
                    />
                  )
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col gap-2 items-center justify-start xl:w-[50%]">
        {/* Profile song */}
        <div className="bg-light-secondary rounded-lg w-full h-fit flex flex-col py-1 px-2">
          <span className="font-medium">Profile Song</span>

          <div className="flex gap-1 items-center justify-between">
            <div className="flex gap-1 items-center justify-center">
              <Image
                src={"/temp-song-poster.jpg"}
                width={40}
                height={40}
                alt="Play"
                className="cursor-pointer rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-medium">I Guess</span>
                <span className="text-secondary-text text-sm">KRSNA</span>
              </div>
            </div>

            <button className="font-medium text-primary-purple hover:text-primary-purple-hover cursor-pointer transition-all duration-500">
              Remove
            </button>
          </div>
        </div>

        {/* Search song */}
        <div className="w-full bg-light-secondary rounded-lg py-2 gap-2 flex flex-col items-center justify-start h-[60vh]">
          <div className="w-full px-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-primary border border-border rounded-xl px-2 py-2 outline-none"
            />
          </div>

          <div className="w-full h-full flex flex-col gap-2 px-2 overflow-y-scroll">
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
          </div>
        </div>

        {/* Followers/Following List */}
        <div className="w-full items-center justify-start bg-light-secondary py-2 rounded-lg flex flex-col gap-2 h-[80vh]">
          <div className="flex w-full items-center justify-start gap-2 px-2">
            <button
              className={`px-4 py-1 rounded-lg cursor-pointer ${
                isFollower ? "bg-white text-black" : "bg-secondary text-white"
              }`}
              onClick={() => {
                setFollower(true);
              }}
            >
              Followers
            </button>
            <button
              className={`px-4 py-1 rounded-lg cursor-pointer ${
                isFollower ? "bg-secondary text-white" : "bg-white text-black"
              }`}
              onClick={() => {
                setFollower(false);
              }}
            >
              Following
            </button>
          </div>

          <div className="flex items-center justify-center px-2 w-full">
            <input
              type="text"
              placeholder="Search"
              className="placeholder:text-secondary-text rounded-lg border border-border bg-secondary px-2 py-1 outline-none w-full"
            />
          </div>

          {isFollower && (
            <div className="w-full flex flex-col gap-2 px-2 overflow-y-scroll">
              {user.followers?.map((follower) => (
                <FollowerAndFollowing
                  key={Date.now()}
                  isFollower={isFollower}
                  name={follower.fullname}
                  username={follower.username}
                  profilePic={follower.profile_pic}
                  userId={follower._id}
                />
              ))}
            </div>
          )}

          {!isFollower && (
            <div className="w-full flex flex-col gap-2 px-2 overflow-y-scroll">
              {user.following?.map((following) => (
                <FollowerAndFollowing
                  key={Date.now()}
                  isFollower={isFollower}
                  name={following.fullname}
                  username={following.username}
                  profilePic={following.profile_pic}
                  userId={following._id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfileTab;
