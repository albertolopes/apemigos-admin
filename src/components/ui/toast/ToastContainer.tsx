"use client";

import React, { useContext } from "react";
import { ToastContext } from "@/context/ToastContext";
import ToastItem from "@/components/ui/toast/ToastItem";

const ToastContainer: React.FC = () => {
    const context = useContext(ToastContext);

    if (!context) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-sm px-4">
            {context.toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
};

export default ToastContainer;
