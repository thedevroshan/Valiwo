"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GetUserAPI } from "../api/user.api";
import { isAxiosError } from "axios";

/// Store
import { useUserStore, defaultUser } from "../stores/user-store";

const AuthUserContext = React.createContext(0);

export const AuthUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setUser } = useUserStore()

  const { mutate: fetchUser } = useMutation({
    mutationFn: GetUserAPI,
    onSuccess: (data) => {
      if(!data.ok){
        console.log(data.msg)
        return;
      }
      setUser(data.user);
    },
    onError: (error) => {
      if(isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Redirecting to singin page.
          if(window.location.pathname !== '/auth/signin' && window.location.pathname !== '/auth/signup') {
            window.location.href = '/auth/signin';
          }
          setUser(defaultUser)
        }
      }
    },
  });

  useEffect(() => {
    fetchUser();
    return () => {
      setUser(defaultUser);
    };
  }, []);

  return (
    <AuthUserContext.Provider value={0}>
      {children}
    </AuthUserContext.Provider>
  );
};
