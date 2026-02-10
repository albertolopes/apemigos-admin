"use client";

import React from "react";
import { Modal } from "./index";
import Alert from "../alert/Alert";
import Button from "../button/Button";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "success" | "error" | "warning" | "info";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "warning",
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-md">
            <div className="p-6">
                <Alert variant={variant} title={title} message={message} />

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={variant === "error" || variant === "warning" ? "bg-error-500 hover:bg-error-600" : ""}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
