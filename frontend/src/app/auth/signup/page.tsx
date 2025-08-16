"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import z from "zod";

// APIs
import { SignUpAPI } from "../../api/auth.api";



// Interfaces
interface ISignUpInfo {
    username: string,
    fullname: string,
    email: string,
    password: string,
    profile_pic: string,
    auth: string | undefined,
}

const SignUp = () => {
  const [signUpInfo, setSignUpInfo] = useState<ISignUpInfo>({
    username: "",
    fullname: "",
    email: "",
    password: "",
    profile_pic: "",
    auth: undefined,
  });
  const [signUpError, setSignUpError] = useState<string>("");
  const [passwordType, setPasswordType] = useState<string>("password");

  const searchParams = useSearchParams();

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: SignUpAPI,
    onSuccess: (data) => {
      if(signUpInfo.auth != undefined && data.ok){
        window.location.href = '/'
      }
    },
    onError: (error) => {
        if(isAxiosError(error)){
            setSignUpError(error.response?.data?.msg)
        }
    },
  });

  // sign Up Schema
  const SignUpSchema = z.object({
    fullname: z.string().min(1, { message: "Full Name is required." }),
    username: z
      .string()
      .min(1, { message: "Username is required." })
      .regex(/^[a-z0-9._]+$/, {
        message:
          "Username can only contain lowercase letters, numbers, dots and underscores.",
      }),
    email: z.string().email({ message: "Email is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),
  });

  // useEffects
  useEffect(() => {
    setSignUpInfo({
      ...signUpInfo,
      fullname: searchParams.get("fullname") ?? "",
      email: searchParams.get("email") ?? "",
      profile_pic: searchParams.get('profile_pic') ?? "",
      auth: searchParams.get('auth') ?? undefined
    });

    return () => {
      setSignUpInfo({...signUpInfo, fullname: "",username: "",email: "", password: "", auth: undefined})
    };
  }, []);

  return (
    <section className="w-[90vw] h-[85vh] lg:w-[70vw] lg:h-[80vh] rounded-xl flex items-center justify-start bg-secondary border border-border mx-auto mt-15">
      <div className="flex-col rounded-xl items-center justify-center w-[55%] h-full hidden md:flex">
        <Image
          src={"/valiwo-post.jpg"}
          alt="Post Image"
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-bl-xl rounded-tl-xl shadow-md"
        />
      </div>

      {!isSuccess && signUpInfo.auth == undefined && (
        <div className="flex flex-col items-center justify-start py-6 w-[100%] md:w-[45%] h-full gap-3">
          <span className="font-extrabold tracking-widest text-3xl select-none">
            VALIWO
          </span>
          {signUpError && (
            <span className="text-sm text-red-500 -mb-4 text-center">
              {signUpError}
            </span>
          )}

          <div className="flex flex-col items-center justify-start w-full h-fit mt-3 gap-2">
            <input
              type="text"
              placeholder="Username"
              className="w-[90%] p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={signUpInfo.username}
              onChange={(e) =>
                setSignUpInfo({ ...signUpInfo, username: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Full Name"
              className="w-[90%] p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={signUpInfo.fullname}
              onChange={(e) =>
                setSignUpInfo({ ...signUpInfo, fullname: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-[90%] p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={signUpInfo.email}
              onChange={(e) =>
                setSignUpInfo({ ...signUpInfo, email: e.target.value })
              }
            />

            <div className="flex w-[90%] h-fit items-center justify-end">
              <input
                type={passwordType}
                placeholder="Password"
                className="w-[100%] p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={signUpInfo.password}
                onChange={(e) =>
                  setSignUpInfo({ ...signUpInfo, password: e.target.value })
                }
              />
              <span
                className="absolute mr-4 select-none cursor-pointer hover:text-gray-500 transition-all duration-200"
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                  if ((e.target as HTMLSpanElement).innerHTML == "Show") {
                    (e.target as HTMLSpanElement).innerHTML = "Hide";
                    setPasswordType("text");
                  } else {
                    (e.target as HTMLSpanElement).innerHTML = "Show";
                    setPasswordType("password");
                  }
                }}
              >
                Show
              </span>
            </div>

            <button
              className={`w-[90%] p-2 text-white rounded-lg cursor-pointer transition-all duration-600 hover:bg-primary-purple-hover ${
                isPending ? "bg-primary-purple-hover" : "bg-primary-purple"
              } mt-2`}
              onClick={() => {
                const validation = SignUpSchema.safeParse(signUpInfo);
                if (!validation.success) {
                  setSignUpError(
                    JSON.parse(validation.error.message)[0].message
                  );
                  return;
                }
                setSignUpError("")

                mutate(signUpInfo);
              }}
            >
              {isPending ? "Wait..." : "Sign Up"}
            </button>
          </div>

          <span className="text-xl font-bold text-secondary-text">OR</span>

          <button
            className="w-[90%] bg-light-secondary rounded-lg py-2 cursor-pointer hover:bg-secondary transition-all duration-500 border border-border"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google`)
            }
          >
            Continue with Google
          </button>

          <span className="text-primary-text text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary-purple font-bold">
              Sign In
            </Link>
          </span>
        </div>
      )}

      {isSuccess && signUpInfo.auth == undefined && (
        <div className="w-[45%] px-4 flex items-center flex-col justify-center gap-4">
          <span className="text-xl font-medium text-center">
            We have sent a email for verification of your email. Check Inbox or
            Spam folder.
          </span>

          <Link
            href={"https://mail.google.com/mail/u/0/#inbox"}
            target="_blank"
            className="bg-primary-purple hover:bg-primary-purple-hover px-9 py-2 rounded-lg transition-all duration-300 font-medium"
          >
            Check Email
          </Link>
        </div>
      )}

      {signUpInfo.auth != undefined && <div className="w-[45%] h-full flex flex-col items-center justify-center gap-7 select-none">
        <span className="text-xl font-medium">Sign In with Google</span>

        {signUpError && <span className="text-red-700 text-sm font-medium text-center px-3">{signUpError}</span>}

        <div className="w-full h-fit flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col w-[90%] h-fit items-start justify-center">
            <label htmlFor="username" className="">
              Choose a Username*.{" "}
              <span className="text-xs text-red-600">Requried.</span>
            </label>

            <input
              type="text"
              id="username"
              placeholder="Username"
              className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={signUpInfo.username}
              onChange={(e) =>
                setSignUpInfo({ ...signUpInfo, username: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col w-[90%] h-fit items-start justify-center">
            <label htmlFor="password" className="">
              Create Password*.{" "}
              <span className="text-xs text-red-600">
                This will help in credential login.
              </span>
            </label>

            <div className="flex w-full h-fit items-center justify-end">
              <input
                type={passwordType}
                placeholder="Password"
                className="w-[100%] p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={signUpInfo.password}
                onChange={(e) =>
                  setSignUpInfo({ ...signUpInfo, password: e.target.value })
                }
              />
              <span
                className="absolute mr-4 select-none cursor-pointer hover:text-gray-500 transition-all duration-200"
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                  if ((e.target as HTMLSpanElement).innerHTML == "Show") {
                    (e.target as HTMLSpanElement).innerHTML = "Hide";
                    setPasswordType("text");
                  } else {
                    (e.target as HTMLSpanElement).innerHTML = "Show";
                    setPasswordType("password");
                  }
                }}
              >
                Show
              </span>
            </div>
          </div>
        </div>

        <button
          className={`hover:bg-primary-purple-hover ${
            isPending ? "bg-primary-purple-hover" : "bg-primary-purple"
          } py-2 rounded-lg w-[90%] cursor-pointer transition-all duration-300`}
          disabled={isPending}
          onClick={() => {
            const validation = SignUpSchema.safeParse(signUpInfo)
            if(!validation.success){
              setSignUpError(JSON.parse(validation.error.message)[0].message)
              return
            }
            setSignUpError("")
            
            mutate(signUpInfo)
          }}
        >
          {isPending ? "Wait..." : "Continue"}
        </button>
      </div>}
    </section>
  );
};

export default SignUp;
