import React, { useEffect, useState } from 'react';
import { Trash2, LogOut, Lock, AlertTriangle } from 'lucide-react';

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

    const renderIcon = () => {
        const iconClasses = "w-6 h-6";
        switch (type) {
            case 'logout':
                return <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4"><LogOut className={iconClasses} /></div>;
            case 'delete':
                return <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4"><Trash2 className={iconClasses} /></div>;
            case 'timeout':
                return <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4"><Lock className={iconClasses} /></div>;
            case 'warning':
            default:
                return <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4"><AlertTriangle className={iconClasses} /></div>;
        }
    };

    const confirmButtonColor = type === 'delete' || type === 'logout' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700';

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div 
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
                onClick={type !== 'timeout' ? onClose : undefined} 
                aria-hidden="true" 
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className={`inline-block transform overflow-hidden rounded-2xl bg-white p-6 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:align-middle duration-300 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95 sm:translate-y-0 sm:scale-95'}`}>
                {renderIcon()}
                
                <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-bold leading-6 text-gray-900 font-['Roboto_Condensed',sans-serif]">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 font-['Inter',sans-serif]">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    {type !== 'timeout' && cancelText && (
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 sm:w-auto font-['Inter',sans-serif] transition-colors"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        type="button"
                        className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto font-['Inter',sans-serif] transition-colors ${confirmButtonColor}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
