'use client';
import React from 'react'
import Image from 'next/image'

const ProfileLink = ({title, link}:{title: string, link: string}) => {
  return (
    <div className='bg-secondary rounded-lg gap-2 px-2 py-1 flex items-center justify-between'>
        <div className='flex flex-col items-start justify-center'>
            <span className='text-lg font-medium'>{title}</span>
            <span className='text-sm font-medium text-secondary-text'>{link}</span>
        </div>

        <div className='flex gap-2 px-3 py-1 bg-light-secondary rounded-lg items-center justify-center h-[80%]'>
            <Image
            src={'/edit-icon.png'}
            height={25}
            width={25}
            alt='Edit'
            className='cursor-pointer'
            />

            <div className='border border-border rounded-lg h-[100%] w-1/4 bg-border'></div>

            <Image
            src={'/trash-icon.png'}
            height={25}
            width={25}
            alt='Remove'
            className='cursor-pointer'
            />
        </div>
    </div>
  )
}

export default ProfileLink