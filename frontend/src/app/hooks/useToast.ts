'use client';
import { useAppStore, IToast } from "../stores/app-store"



export const useToast = () => {
    const appStore = useAppStore();

    const addToast = (toast:Omit<IToast, 'id'>) => {
        const id = crypto.randomUUID();
        appStore.addToast({...toast, id});
    }

    const removeToast = (id: string) => {
        appStore.removeToast(id);
    }

    const clearToasts = () => {
        appStore.clearToasts();
    }

    return { toasts: appStore.toast, addToast, removeToast, clearToasts };
}