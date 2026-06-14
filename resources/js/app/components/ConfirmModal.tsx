import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'logout' | 'delete' | 'timeout' | 'warning' | 'danger' | 'success' | 'info';
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

    const confirmButtonColor = type === 'delete' || type === 'logout' || type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white';

    const getIcon = () => {
        if (type === 'success') return <CheckCircle size={32} />;
        if (type === 'info') return <Info size={32} />;
        if (type === 'warning' || type === 'danger' || type === 'timeout' || type === 'delete' || type === 'logout') return <ShieldAlert size={36} />;
        return <AlertTriangle size={32} />;
    };

    const getIconColor = () => {
        if (type === 'success') return 'text-emerald-600';
        if (type === 'danger' || type === 'delete' || type === 'logout' || type === 'warning' || type === 'timeout') return 'text-amber-500';
        return 'text-blue-500';
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div 
                className="fixed inset-0 bg-slate-900/40 transition-opacity" 
                onClick={type !== 'timeout' ? onClose : undefined} 
                aria-hidden="true" 
            />

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className={`inline-block transform overflow-hidden rounded-2xl bg-white p-6 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:align-middle duration-300 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95 sm:translate-y-0 sm:scale-95'}`}>
                <div className="flex flex-col items-center text-center">
                    <div className={`mx-auto flex items-center justify-center mb-4 ${getIconColor()}`}>
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 font-['Inter',sans-serif] leading-tight">
                            {title}
                        </h3>
                        <p className="mt-3 text-[14px] text-slate-500 font-['Inter',sans-serif] leading-relaxed max-w-sm mx-auto">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-8 w-full">
                    {type === 'danger' ? (
                        <>
                            <button
                                type="button"
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm w-full sm:w-auto min-w-[120px]"
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                            <button
                                type="button"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm w-full sm:w-auto min-w-[120px]"
                                onClick={onClose}
                            >
                                {cancelText}
                            </button>
                        </>
                    ) : (
                        <>
                            {type !== 'timeout' && cancelText && (
                                <button
                                    type="button"
                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto min-w-[120px]"
                                    onClick={onClose}
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                type="button"
                                className={`${confirmButtonColor} px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm w-full sm:w-auto min-w-[120px]`}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
