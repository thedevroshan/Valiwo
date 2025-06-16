'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

const Home = () => {
  const searchParams = useSearchParams()

  if(searchParams.get('token') != undefined || searchParams.get('token') != null){
    window.location.href = process.env.NEXT_PUBLIC_FRONTEND_URL == undefined?'http://localhost:3000':process.env.NEXT_PUBLIC_FRONTEND_URL

    document.cookie = `session=${searchParams.get('token')}`
  }

  return (
    <div>Home</div>
  )
}

export default Home