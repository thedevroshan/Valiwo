"use client";
import React, { ChangeEvent } from "react";
import Image from "next/image";

// Stores
import { useUserStore } from "../stores/user-store";

// Components
import ProfileLink from "./components/ProfileLink";
import Song from "./components/Song";


// Hooks
import { useDebounceAPI } from "../hooks/useDebounceAPI";


// API
import { UpdateProfileAPI } from "../api/profile.api";

const ProfileTab = () => {
  // user store values
  const user = useUserStore();
  const profilePic = useUserStore((state) => state.profile_pic);
  const fullname = useUserStore((state) => state.fullname);
  const username = useUserStore((state) => state.username);
  const bio = useUserStore((state) => state.bio);
  const gender = useUserStore(state => state.gender)

  // user store func
  const setUser = useUserStore((state) => state.setUser);


// Hooks
  const { debounceMutate } = useDebounceAPI(UpdateProfileAPI, 800)

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
            <button className="bg-primary-purple hover:bg-primary-purple-hover rounded-lg cursor-pointer px-12 py-2 transition-all duration-500">
              Upload new
            </button>
            <button className="bg-light-secondary hover:bg-light-secondary/70 rounded-lg cursor-pointer px-12 py-2 transition-all duration-500">
              Remove
            </button>
          </div>
        </div>

        {/* User details section */}
        <div className="w-full flex items-start justify-center gap-3 flex-col">
          {/* Full name */}
          <div className="flex flex-col w-full items-start justify-center gap-1">
            <label htmlFor="full-name" className="font-medium">
              Full Name
            </label>
            {<span className="text-red-800 text-sm hidden">Error Message</span>}
            <input
              type="text"
              id="full-name"
              className="w-full bg-light-secondary px-3 py-2 text-lg outline-none border-none rounded-lg"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUser({ ...user, fullname: e.target.value });
                debounceMutate({field: "fullname", fieldValue:e.target.value})
              }}
              value={fullname}
            />
          </div>

          {/* Username */}
          <div className="flex flex-col w-full items-start justify-center gap-1">
            <label htmlFor="user-name" className="font-medium">
              Username
            </label>
            {<span className="text-red-800 text-sm hidden">Error Message</span>}
            <input
              type="text"
              id="user-name"
              className="w-full bg-light-secondary px-3 py-2 text-lg outline-none border-none rounded-lg"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUser({ ...user, username: e.target.value });
                debounceMutate({field: "username", fieldValue: e.target.value})
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
            {<span className="text-red-800 text-sm hidden">Error Message</span>}
            <textarea
              id="bio"
              className="w-full bg-light-secondary px-3 py-2 text-lg outline-none border-none rounded-lg resize-none"
              rows={5}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setUser({ ...user, bio: e.target.value });
                debounceMutate({field: "bio", fieldValue: e.target.value})
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
              onChange={(e: ChangeEvent<HTMLSelectElement>)=>{
                setUser({...user, gender: e.target.value})
                debounceMutate({field: 'gender', fieldValue: e.target.value})
              }}
              value={typeof gender === 'string'?gender:''}
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
            <select
              name="profile-visibility"
              id="profile-visibility"
              className="bg-light-secondary px-3 py-2 outline-none border-none rounded-lg w-full text-lg"
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
                />
                <input
                  type="text"
                  className="bg-primary outline-none px-2 py-1 rounded-lg border border-border placeholder:text-secondary-text w-full"
                  placeholder="Title"
                />
              </div>
              <button className="w-full rounded-md cursor-pointer py-1 bg-primary-purple hover:bg-primary-purple-hover transition-all duration-500">
                Add Link
              </button>
            </div>

            <div className="w-full h-full flex flex-col overflow-y-scroll px-2 py-2 gap-1">
              <ProfileLink title="Portfolio" link="https://roshankewt.com" />
              <ProfileLink title="Portfolio" link="https://roshankewt.com" />
              <ProfileLink title="Portfolio" link="https://roshankewt.com" />
              <ProfileLink title="Portfolio" link="https://roshankewt.com" />
              <ProfileLink title="Portfolio" link="https://roshankewt.com" />
              <ProfileLink title="Portfolio" link="https://roshankewt.com" />
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
            <button className="bg-secondary px-4 py-1 rounded-lg cursor-pointer">
              Followers
            </button>
            <button className="bg-white px-4 py-1 rounded-lg cursor-pointer text-black">
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

          <div className="w-full flex flex-col gap-2 px-2 overflow-y-scroll">
            <Song />
            <Song />
            <Song />
            <Song />
            <Song />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileTab;
