"use client";
import React from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Store
import { useUserStore } from "@/app/stores/user-store";

// API
import { FollowUnfollowAPI, RemoveFollowerAPI } from "@/app/api/follow.api";
import { isAxiosError } from "axios";

const FollowerAndFollowing = ({
  isFollower,
  name,
  username,
  profilePic,
  userId,
}: {
  isFollower: boolean;
  name: string;
  username: string;
  profilePic: string;
  userId: string;
}) => {
  // user store values
  const user = useUserStore();

  // user store functions
  const setUser = useUserStore(state => state.setUser)

  // Hooks
  const queryClient = useQueryClient()

  // Mutations
  const followUnfollowMutation = useMutation({
    mutationFn: FollowUnfollowAPI,
    onSuccess: (data) => {
      if(!data.ok){
        console.log(data.msg)
        return;
      }
      queryClient.invalidateQueries({queryKey: ["following-list"]})
    },
    onError: (error) => {
      if(isAxiosError(error)){
        console.log(error.response?.data)
      }
    }
  })

  const removeFollowerMutation = useMutation({
    mutationFn: RemoveFollowerAPI,
    onSuccess: (data) => {
      if(!data.ok){
        console.log(data.msg)
        return;
      }
      queryClient.invalidateQueries({queryKey: ['followers-list']})
    },
    onError: (error) => {
      if(isAxiosError(error)){
        console.log(error.response?.data)
      }
    }
  })


  return (
    <div className="bg-primary w-full flex gap-2 items-center justify-start px-2 py-2 rounded-xl">
      <Image
        src={profilePic ? profilePic : "/user-icon.png"}
        width={45}
        height={45}
        alt="song poster."
        className="rounded-full"
      />

      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-secondary-text text-sm font-medium">
          {username}
        </span>
      </div>

      {isFollower && (
        <div className="flex gap-2 items-center justify-center ml-auto">
          {!user.following.some(following => following._id == userId) && (
            <button className="text-primary-purple hover:text-primary-purple-hover transition-all duration-500 cursor-pointer font-medium" onClick={()=>{
              followUnfollowMutation.mutate({username})
            }}>
              Follow back
            </button>
          )}
          <button className="text-secondary-text hover:text-red-800 transition-all duration-500 cursor-pointer font-medium" onClick={()=>{
            removeFollowerMutation.mutate({followerId: userId})
          }}>
            Remove
          </button>
        </div>
      )}

      {!isFollower && (
        <div className="flex gap-2 items-center justify-center ml-auto">
          <button className="text-primary-purple hover:text-primary-purple-hover transition-all duration-500 cursor-pointer font-medium">
            Message
          </button>
          <button className="text-secondary-text hover:text-red-800 transition-all duration-500 cursor-pointer font-medium" onClick={()=>{
            followUnfollowMutation.mutate({username})
          }}>
            Unfollow
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowerAndFollowing;
