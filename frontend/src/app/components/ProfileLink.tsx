'use client';
import React from 'react'
import Image from 'next/image';

interface ILinkProps {
    title: string;
    link: string
}

const ProfileLink = (props:ILinkProps) => {
  return (
    <div className='bg-primary w-full px-2 py-1 flex items-center justify-between rounded-lg'>
      <div className='flex flex-col w-fit h-fit items-start justify-center'>
       <span className='font-medium'>{props.title}</span>
       <span className='text-secondary-text text-sm'>{props.link}</span>
      </div>

      <div className='flex bg-light-secondary rounded-md px-3 py-2 gap-2 w-fit'>
        <Image
        src={"/edit-icon.png"}
        width={20}
        height={20}
        alt='Edit'
        className='cursor-pointer'
        />

        <div className='border-border border'></div>

        <Image
        src={"/trash-icon.png"}
        width={20}
        height={20}
        alt='Edit'
        className='cursor-pointer'
        />
      </div>
    </div>
  )
}

export default ProfileLink