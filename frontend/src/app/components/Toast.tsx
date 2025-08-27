'use client';
import React, { use } from 'react'
import Image from 'next/image';

// Hooks
import {useToast} from '@/app/hooks/useToast';

interface IToastProps {
    title: string;
    msg: string;
    icon: string;
    id: string;
}

const Toast = (props:IToastProps) => {
  const {removeToast} = useToast();

  return (
    <div className='w-full h-fit py-2 px-2 rounded-xl border border-border flex gap-2 items-center justify-start bg-primary/90 backdrop-blur-sm select-none'>
      <Image
      src={props.icon}
      width={65}
      height={65}
      alt='icon'
      />

      <div className='flex flex-col gap-1 w-[65%]'>
        <span className='font-semibold text-white w-full text-lg'>{props.title}</span>
        <span className='text-secondary-text w-full font-medium'>{props.msg}</span>
      </div>

      <button className='bg-light-secondary rounded-md cursor-pointer px-4 py-2 hover:bg-white hover:text-black  duration-500 transition-all outline-none border-none' onClick={() => {
        removeToast(props.id);
      }}>Close</button>
    </div>
  )
}

export default Toast