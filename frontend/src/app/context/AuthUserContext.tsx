"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GetUserAPI } from "../api/user.api";
import { isAxiosError } from "axios";

const AuthUserContext = React.createContext({ user: null });

export const AuthUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any>(null);

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
          
          setUser(null);
        }
      }
    },
  });

  useEffect(() => {
    fetchUser();
    return () => {
      setUser(null);
    };
  }, []);

  return (
    <AuthUserContext.Provider value={{ user }}>
      {children}
    </AuthUserContext.Provider>
  );
};
