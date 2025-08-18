import { create } from "zustand";


export interface IUserStore {
  fullname: string;
  username: string;
  email: string;
  bio: string;
  followers: any[];
  following: any[];
  is_private: boolean;
  recovery_email: string;
  is_two_factor_auth: string;
  two_factor_auth_option: string;
  phone: string;
  account_type: string;
  links: any[];
  pinned_post: any[];
  posts: number;
  profile_pic: string;
  gender: string;
  birthday: Date | null;
  _id: string;
}

interface IUserState extends IUserStore {
  setUser: (user: Partial<IUserStore>) => void;
}

export const defaultUser = {
  fullname: "",
  username: "",
  email: "",
  bio: "",
  followers: [],
  following: [],
  is_private: false,
  account_type: "",
  recovery_email: "",
  phone: "",
  is_two_factor_auth: "",
  two_factor_auth_option: "",
  links: [],
  pinned_post: [],
  posts: 0,
  profile_pic: "",
  gender: "",
  birthday: null,
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
