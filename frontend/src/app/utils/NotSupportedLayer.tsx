'use client';
import React from 'react'
import Link from 'next/link';

const NotSupportedLayer = () => {
  return (
    <div className='w-[100vw] h-[100vh] bg-primary gap-3 md:hidden flex flex-col items-center justify-center select-none'>
        <span className='font-medium text-2xl md:text-3xl'>Download Valiwo App.</span>
        <Link href={'#'} className='bg-primary-purple transition-all duration-200 hover:bg-primary-purple-hover px-6 py-2 rounded-md text-lg'>Download Valiwo</Link>
    </div>
  )
}

export default NotSupportedLayer