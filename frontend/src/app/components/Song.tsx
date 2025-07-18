'use client';
import React from 'react'
import Image from 'next/image';

const Song = () => {
  return (
    <div className='bg-primary w-full h-fit px-2 py-2 flex items-center gap-2 rounded-lg'>
        <Image
        src={'/temp-song-poster.jpg'}
        width={40}
        height={40}
        alt='Song Poster'
        className='rounded-full'
        />
        <div className='flex flex-col'>
            <span className=''>Babuaan</span>
            <span className='text-sm text-secondary-text'>Pawan Singh</span>
        </div>

        <button className='text-primary-purple font-medium hover:text-primary-purple-hover transition-all duration-500 cursor-pointer ml-auto'>ADD</button>
    </div>
  )
}

export default Song