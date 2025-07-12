"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

// Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";

const Home = () => {
  const searchParams = useSearchParams();

  // Setting the cookie from the params.
  if (
    searchParams.get("token") != undefined ||
    searchParams.get("token") != null
  ) {
    window.location.href =
      process.env.NEXT_PUBLIC_FRONTEND_URL == undefined
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_FRONTEND_URL;

    document.cookie = `session=${searchParams.get("token")}`;
  }

  return (
    <section className="w-[100vw] h-[100vh] flex flex-col items-center lg:items-start">
      <Header />
      <Navbar />
    </section>
  );
};

export default Home;
