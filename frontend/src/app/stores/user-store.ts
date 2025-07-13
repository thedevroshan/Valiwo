import { create } from "zustand";

interface IUser {
  fullname: string;
  username: string;
  email: string;
  bio: string;
  followers: any[];
  following: any[];
  is_private: boolean;
  links: any[];
  pinned_post: any[];
  posts: number;
  profile_pic: string;
  _id: string;
}

interface IUserState extends IUser {
  setUser: (user: Partial<IUser>) => void;
}

export const defaultUser = {
  fullname: "",
  username: "",
  email: "",
  bio: "",
  followers: [],
  following: [],
  is_private: false,
  links: [],
  pinned_post: [],
  posts: 0,
  profile_pic: "",
  _id: "",
};

export const useUserStore = create<IUserState>((set) => ({
  ...defaultUser,
  setUser: (user) =>
    set((state) => ({
      ...state,
      ...user,
    }))  
}));
