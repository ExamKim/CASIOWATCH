import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../store/uiSlice";
import "../styles/ui.css";

const TOAST_TTL = 3000;

export default function ToastContainer() {
    const dispatch = useDispatch();
    const toasts = useSelector((state) => state.ui.toasts);

    useEffect(() => {
        if (toasts.length === 0) return;

        const timers = toasts.map((toast) =>
            setTimeout(() => dispatch(removeToast(toast.id)), TOAST_TTL)
        );

        return () => timers.forEach(clearTimeout);
    }, [toasts, dispatch]);

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" aria-live="polite" aria-atomic="false">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast-item toast-${toast.type}`}>
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
