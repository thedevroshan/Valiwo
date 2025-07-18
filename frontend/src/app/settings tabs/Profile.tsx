"use client";
import React from "react";
import Image from "next/image";

// Components
import ProfileLink from "../components/ProfileLink";
import Song from "../components/Song";
import Follower from "../components/Follower";

// Stores
import { useUserStore } from "../stores/user-store";

const Profile = () => {
  // user store values
  const profilePic = useUserStore((state) => state.profile_pic);
  const username = useUserStore((state) => state.username)
  const fullname = useUserStore(state => state.fullname)

  return (
    <div className="xl:flex-row xl:gap-3 w-full h-fit flex flex-col">
      <div className="flex flex-col items-center justify-start xl:w-[50%] w-full gap-2 mb-4">
        {/* Profile Pic section */}
        <div className="flex gap-3 w-full h-fit items-center justify-around">
          <Image
            src={profilePic ? profilePic : "/user-icon.png"}
            width={150}
            height={150}
            alt="Profile Pic"
            className="rounded-full border-border border-4"
          />

          <div className="flex flex-col gap-2 h-fit">
            <button className="bg-primary-purple rounded-lg w-56 py-2 cursor-pointer hover:bg-primary-purple-hover transition-all duration-500">
              Upload new
            </button>
            <button className="bg-light-secondary py-2 rounded-lg cursor-pointer transition-all duration-500 hover:bg-light-secondary/75">
              Remove
            </button>
          </div>
        </div>

        {/* User details section */}
        <div className="w-full h-fit flex flex-col gap-2">
          {/* Full name */}
          <div className="flex flex-col">
            <label htmlFor="full-name" className="font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="full-name"
              className="bg-light-secondary rounded-lg py-2 text-xl outline-none border-none px-2"
              value={fullname}
              defaultValue={""}
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="bg-light-secondary rounded-lg py-2 text-xl outline-none border-none px-2"
              value={username}
              defaultValue={""}
            />
            <span className="text-secondary-text">
              You can get back to your previous username anytime within 14 days.
            </span>
          </div>

          {/*   Bio */}
          <div className="flex flex-col">
            <label htmlFor="bio" className="font-medium">
              Bio
            </label>
            <span className="font-medium">{200}</span>
            <textarea
              id="bio"
              rows={5}
              className="resize-none bg-light-secondary rounded-lg py-2 text-xl outline-none border-none px-2"
            />
          </div>

          {/*   Gender */}
          <div className="flex flex-col gap-1">
            <label htmlFor="gender" className="font-medium">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className="bg-light-secondary px-2 py-3 border-none outline-none rounded-lg"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <div className="flex">
              <span>Display gender on profile?</span>
            </div>
          </div>

          {/*   Birthday */}
          <div className="flex flex-col">
            <label htmlFor="birthday" className="font-medium">
              Birthday
            </label>
            <input
              type="date"
              className="outline-none border-none bg-light-secondary py-2 px-2 rounded-lg"
            />
          </div>

          {/*   Profile Visibility */}
          <div className="flex flex-col">
            <label htmlFor="profile-visibility" className="font-medium">
              Profile Visibility
            </label>
            <select
              name="profile-visibility"
              id="profile-visibility"
              className="bg-light-secondary px-2 py-3 border-none outline-none rounded-lg"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          {/* Links */}
          <div className="w-full h-[55vh] bg-light-secondary py-1 px-2 flex flex-col rounded-lg gap-2 mt-4">
            <div className="w-full flex gap-2">
              <input
                type="text"
                className="placeholder:text-secondary-text border-border border bg-primary py-1 px-2 rounded-md  outline-none w-[40%]"
                placeholder="Link"
              />
              <input
                type="text"
                className="placeholder:text-secondary-text border-border border bg-primary py-1 px-2 rounded-md  outline-none w-[40%]"
                placeholder="Title"
              />

              <button className="cursor-pointer bg-primary-purple hover:bg-primary-purple-hover transition-all duration-500 rounded-md w-[20%]">
                Add
              </button>
            </div>

            <div className="flex flex-col w-full h-full overflow-y-scroll gap-2">
              <ProfileLink
                title={"Portfolio"}
                link={"https://roshankewat.com"}
              />
              <ProfileLink
                title={"Portfolio"}
                link={"https://roshankewat.com"}
              />
              <ProfileLink
                title={"Portfolio"}
                link={"https://roshankewat.com"}
              />
              <ProfileLink
                title={"Portfolio"}
                link={"https://roshankewat.com"}
              />
              <ProfileLink
                title={"Portfolio"}
                link={"https://roshankewat.com"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:w-[50%] w-full items-center justify-start">
        {/* Profile Songs */}
        <div className="w-full h-fit flex flex-col gap-2 mt-4">
          <div className="bg-light-secondary items-start gap-1 px-2 py-2 rounded-xl w-full h-fit flex flex-col">
            <span className="font-medium">Profile Songs</span>

            <div className="flex w-full h-fit items-center justify-between">
              <div className="flex items-center justify-start">
                <Image
                  src={"/play-icon.png"}
                  width={30}
                  height={30}
                  alt="Play song"
                  className="cursor-pointer"
                />
                <span>I Guess - KRSNA</span>
              </div>
              <button className="text-primary-purple hover:text-primary-purple-hover transition-all duration-500 cursor-pointer">
                Remove
              </button>
            </div>
          </div>

          <div className="bg-light-secondary flex flex-col items-center w-full h-[55vh] px-2 py-1 rounded-lg gap-2">
            <input
              type="text"
              className="bg-primary outline-none border border-border placeholder:text-secondary-text px-2 py-1 rounded-lg w-full"
              placeholder="Search"
            />

            <div className="flex flex-col items-center justify-start overflow-y-scroll gap-2 w-full h-full px-2">
              <Song />
              <Song />
              <Song />
              <Song />
              <Song />
            </div>
          </div>
        </div>

        {/* Followers/Following List */}
        <div className="w-full h-[65vh] px-2 py-2 rounded-lg gap-2 bg-light-secondary flex flex-col items-start justtify-start mt-4">
          <div className="flex gap-2 items-center justify-start">
            <button className="bg-white text-black px-6 py-1 rounded-lg cursor-pointer font-medium">
              Followers
            </button>
            <button className="bg-secondary text-white px-6 py-1 rounded-lg cursor-pointer font-medium">
              Following
            </button>
          </div>

          <input
            type="text"
            className="placeholder:text-secondary-text bg-primary px-2 py-1 rounded-lg w-full border border-border outline-none"
            placeholder="Search"
          />

          <div className="flex flex-col gap-2 items-start justify-start w-full h-full overflow-y-scroll px-2">
            <Follower />
            <Follower />
            <Follower />
            <Follower />
            <Follower />
            <Follower />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
