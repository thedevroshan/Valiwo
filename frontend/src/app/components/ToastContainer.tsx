"use client";
import React from "react";

// Stores
import { useAppStore } from "../stores/app-store";

// Components
import Toast from "./Toast";

const ToastContainer = () => {
  const appStore = useAppStore();
  const toast = useAppStore((state) => state.toast);
  const isToast = useAppStore((state) => state.isToast);

  return (
    <section className="fixed bottom-2 z-50 flex flex-col-reverse gap-2 w-[30vw] h-fit px-2">
      {isToast &&
        toast.map((toast, index) => (
          <Toast
            key={toast.id}
            title={toast.title}
            msg={toast.msg}
            icon={toast.icon}
            id={toast.id}
          />
        ))}
    </section>
  );
};

export default ToastContainer;
