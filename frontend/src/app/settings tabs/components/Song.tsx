'use client';
import React from 'react'
import Image from 'next/image';


const Song = ({}:{}) => {
  return (
    <div className='bg-primary w-full flex gap-2 items-center justify-start px-2 py-2 rounded-xl'>
        <Image
        src={"/temp-song-poster.jpg"}
        width={45}
        height={45}
        alt='song poster.'
        className='rounded-full'
        />

        <div className='flex flex-col'>
            <span className='font-medium'>Babuaan</span>
            <span className='text-secondary-text text-sm font-medium'>Pawan Singh</span>
        </div>

        <div className='flex gap-2 items-center justify-center ml-auto'>
            <Image
            src={"/play-icon.png"}
            width={25}
            height={25}
            alt='Play'
            className='cursor-pointer'
            />
            <button className='text-primary-purple hover:text-primary-purple-hover transition-all duration-500 cursor-pointer font-medium'>Add Song</button>
        </div>
    </div>
  )
}

export default Song