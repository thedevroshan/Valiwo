"use client";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";


// API
import { EditLinkAPI, RemoveLinkAPI } from "@/app/api/profile.api";

// Stores
import { useUserStore } from "@/app/stores/user-store"; 

const ProfileLink = ({ title, link, linkId }: { title: string; link: string, linkId:string }) => {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [editLinkInfo, setEditLinkInfo] = useState<{
    title: string,
    link: string,
    error: string
  }>({title: title, link: link, error: ""})


  // user store function
  const setUser = useUserStore(state => state.setUser)

  // user store values
  const user = useUserStore()
  const links = useUserStore(state => state.links)


  // Mutations
  const editLinkMutation = useMutation({
    mutationFn: EditLinkAPI,
    onSuccess: (data) => {
      if(!data.ok){
        setEditLinkInfo({...editLinkInfo, error: data.msg})
        return
      }
      setEdit(false)
    },
    onError: (error) => {
      if(isAxiosError(error)){
        setEditLinkInfo({...editLinkInfo, error: error.response?.data?.data.msg})
        console.log(error.response?.data)
      }
    }
  })

  const removeLinkMutation = useMutation({
    mutationFn: RemoveLinkAPI,
    onSuccess: (data) => {
      if(!data.ok){
        console.log(data.msg)
        return
      }
      const newLinksArray = links.filter(link => link._id != linkId)
      setUser({...user, links: newLinksArray})
    },
    onError: (error) => {
      if(isAxiosError(error)){
        console.log(error.response?.data)
      }
    }
  })

  return (
    <div className="bg-secondary rounded-lg flex flex-col gap-2 py-2">
      <section className="gap-2 px-2 flex items-center justify-between">
        <div className="flex flex-col items-start justify-center">
          <span className="text-lg font-medium">{editLinkInfo.title}</span>
          <span className="text-sm font-medium text-secondary-text">
            {editLinkInfo.link}
          </span>
        </div>

        <div className="flex gap-2 px-3 py-1 bg-light-secondary rounded-lg items-center justify-center h-[80%]">
          <Image
            src={"/edit-icon.png"}
            height={25}
            width={25}
            alt="Edit"
            className="cursor-pointer"
            onClick={()=>{
              setEdit(!isEdit)
            }}
          />

          <div className="border border-border rounded-lg h-[100%] w-1/4 bg-border"></div>

          <Image
            src={"/trash-icon.png"}
            height={25}
            width={25}
            alt="Remove"
            className="cursor-pointer"
            onClick={()=>{
              removeLinkMutation.mutate({linkId})
            }}
          />
        </div>
      </section>

      {isEdit && (
        <section className="w-full px-2 gap-1 flex flex-col">
          <input
            type="text"
            className="placeholder:text-secondary-text bg-light-secondary w-full border-none outline-none rounded-md px-2 py-1"
            placeholder="Title"
            value={editLinkInfo.title}
            onChange={(e: ChangeEvent<HTMLInputElement>)=>{
              setEditLinkInfo({...editLinkInfo, title: e.target.value})
            }}
          />
          <input
            type="text"
            className="placeholder:text-secondary-text bg-light-secondary w-full border-none outline-none rounded-md px-2 py-1"
            placeholder="Link"
            value={editLinkInfo.link}
            onChange={(e: ChangeEvent<HTMLInputElement>)=>{
              setEditLinkInfo({...editLinkInfo, link: e.target.value})
            }}
          />
          <button className="bg-primary-purple hover:bg-primary-purple-hover rounded-md py-1 cursor-pointer transition-all duration-500" onClick={()=>{
            if(!editLinkInfo.title || !editLinkInfo.link) return;
            editLinkMutation.mutate({
              title: editLinkInfo.title,
              link: editLinkInfo.link,
              linkId
            })
          }}>
            Save
          </button>
        </section>
      )}
    </div>
  );
};

export default ProfileLink;
