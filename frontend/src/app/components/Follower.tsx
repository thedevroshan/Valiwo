'use client';
import React from 'react'
import Image from 'next/image';


const Follower = () => {
  return (
    <div className='bg-primary px-2 py-2 flex items-center justify-start rounded-xl w-full gap-2'>
        <Image
        src={"/temp-song-poster.jpg"}
        width={40}
        height={40}
        alt='Profile Pic'
        className='rounded-full'
        />
        <div className='flex flex-col items-start justify-center'>
            <span>Roshan Kewat</span>
            <span className='text-sm text-secondary-text'>self.roshan</span>
        </div>

        <div className='flex items-center justify-end gap-2 transition-all duration-500 ml-auto'>
            <button className='text-primary-purple font-medium cursor-pointer hover:text-primary-purple-hover transition-all duration-500'>Follow back</button>
            <button className='text-secondary-text hover:text-red-800 font-medium cursor-pointer transition-all duration-500'>Remove</button>
        </div>
    </div>
  )
}

export default Follower