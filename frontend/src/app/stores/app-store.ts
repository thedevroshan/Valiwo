import { create } from "zustand";

interface IAppStoreState {
    isSettings: boolean;
}

interface IAppStore extends IAppStoreState {
    setSettings: (settings: boolean) => void;
}

export const useAppStore = create<IAppStore>((set) => ({
    isSettings: false,
    setSettings: (settings: boolean) => set(() => ({isSettings: settings}))
}))
