import { create } from "zustand";


export interface IToast {
    title: string;
    msg: string;
    icon: string;
    id: string;
}


interface IAppStoreState {
    isSettings: boolean;
    isToast: boolean;
    toast: IToast[];
}

interface IAppStore extends IAppStoreState {
    setSettings: (settings: boolean) => void;
    addToast: (toast: IToast) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

export const useAppStore = create<IAppStore>((set) => ({
    isSettings: false,
    isToast: false,
    toast: [],
    setSettings: (settings: boolean) => set(() => ({isSettings: settings})),
    addToast: (toast: IToast) => set((state) => ({
        toast: [...state.toast, toast],
        isToast: true,
    })),
    removeToast: (id: string) => set((state) => {
        const newToasts = state.toast.filter((toast) => toast.id !== id);
        return {
            toast: newToasts,
            isToast: newToasts.length > 0,
        };
    }),
    clearToasts: () => set(() => ({toast: [], isToast: false})),
}))
