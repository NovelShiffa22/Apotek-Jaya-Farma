import React, { useEffect, useState } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'logout' | 'delete' | 'timeout' | 'warning';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    type = 'warning'
}: ConfirmModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setTimeout(() => setIsVisible(false), 300); // Wait for transition
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    const confirmButtonColor = type === 'delete' || type === 'logout' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white';

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div 
                className="fixed inset-0 bg-slate-900/40 transition-opacity" 
                onClick={type !== 'timeout' ? onClose : undefined} 
                aria-hidden="true" 
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className={`inline-block transform overflow-hidden rounded-xl bg-white p-5 text-left align-bottom shadow-lg transition-all sm:my-8 sm:w-full sm:max-w-sm sm:align-middle duration-300 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95 sm:translate-y-0 sm:scale-95'}`}>
                <div>
                    <h3 className="text-[15px] font-bold text-slate-800 font-['Inter',sans-serif] leading-tight">
                        {title}
                    </h3>
                    <p className="mt-1.5 text-[13px] text-slate-500 font-['Inter',sans-serif] leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    {type !== 'timeout' && cancelText && (
                        <button
                            type="button"
                            className="rounded-lg px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 font-['Inter',sans-serif] transition-colors"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        type="button"
                        className={`rounded-lg px-4 py-2 text-[13px] font-semibold shadow-sm font-['Inter',sans-serif] transition-colors ${confirmButtonColor}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
