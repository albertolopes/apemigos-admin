"use client";

import React, { useEffect, useState, useContext } from "react";
import { Toast, ToastContext } from "@/context/ToastContext";
import Alert from "@/components/ui/alert/Alert";

interface ToastItemProps {
    toast: Toast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
    const context = useContext(ToastContext);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger slide-in
        const timer = setTimeout(() => setIsVisible(true), 10);

        // Auto-remove
        const autoRemoveTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                context?.removeToast(toast.id);
            }, 300); // Wait for slide-out animation
        }, toast.duration || 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(autoRemoveTimer);
        };
    }, [toast, context]);

    return (
        <div
            className={`transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
                }`}
        >
            <Alert
                variant={toast.variant}
                title={toast.title}
                message={toast.message}
            />
        </div>
    );
};

export default ToastItem;
