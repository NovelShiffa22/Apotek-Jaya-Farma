import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { FileText, CheckCircle2, Truck, Bell } from 'lucide-react';
import Header from '../components/Header';

const initialNotifications = [
    {
        id: 1,
        type: 'verified',
        title: 'Resep Obat Sudah Diverifikasi',
        desc: 'Resep dokter nomor #AP-9921 telah diverifikasi oleh apoteker kami. Silakan lanjutkan ke pembayaran atau pengambilan.',
        time: '2 jam yang lalu',
        icon: <FileText size={24} className="text-[#006a3f]" />,
        unread: true,
        bgColor: 'bg-emerald-50'
    },
    {
        id: 2,
        type: 'shipping',
        title: 'Pesanan Sedang Dikirim',
        desc: 'Paket untuk pesanan #JK-1020 sedang diproses oleh kurir kami. Estimasi tiba pukul 15:30 hari ini.',
        time: '5 jam yang lalu',
        icon: <Truck size={24} className="text-gray-500" />,
        unread: false,
        bgColor: 'bg-gray-50'
    },
    {
        id: 3,
        type: 'delivered',
        title: 'Pesanan Telah Diterima',
        desc: 'Terima kasih! Pesanan #JK-1019 telah sampai di tujuan. Bagaimana kualitas layanan kami?',
        time: '1 hari yang lalu',
        icon: <CheckCircle2 size={24} className="text-gray-500" />,
        unread: false,
        bgColor: 'bg-gray-50'
    }
];

export default function Notifications() {
    const [notifications, setNotifications] = useState(() => {
        const savedReadStatus = typeof window !== 'undefined' ? localStorage.getItem('readNotifications') : null;
        if (savedReadStatus) {
            const readIds = JSON.parse(savedReadStatus);
            return initialNotifications.map(notif => 
                readIds.includes(notif.id) ? { ...notif, unread: false } : notif
            );
        }
        return initialNotifications;
    });

    useEffect(() => {
        const readIds = notifications.filter(n => !n.unread).map(n => n.id);
        localStorage.setItem('readNotifications', JSON.stringify(readIds));
        window.dispatchEvent(new Event('notificationsUpdated'));
    }, [notifications]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    const paginatedNotifications = notifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />

            <main className="mx-auto max-w-5xl px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-['Poppins',sans-serif] text-[32px] font-bold text-[#171d19] tracking-tight">
                        Notifikasi Anda
                    </h1>
                    <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                        className="text-[#006a3f] font-['Poppins',sans-serif] text-[14px] font-bold hover:underline"
                    >
                        Tandai semua telah dibaca
                    </button>
                </div>

                <div className="space-y-4 mb-12">
                    {paginatedNotifications.map(notif => (
                        <div 
                            key={notif.id} 
                            className={`relative flex items-start gap-6 p-6 rounded-2xl border ${notif.unread ? 'border-transparent bg-white shadow-sm' : 'border-gray-200 bg-white'}`}
                        >
                            {/* Unread indicator bar */}
                            {notif.unread && (
                                <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#006a3f] rounded-r-md"></div>
                            )}

                            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${notif.bgColor}`}>
                                {notif.icon}
                            </div>

                            <div className="flex-1 pt-1">
                                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#171d19] mb-1">
                                    {notif.title}
                                </h3>
                                <p className="font-['Poppins',sans-serif] text-[14px] text-gray-500 mb-2 leading-relaxed">
                                    {notif.desc}
                                </p>
                                <span className="font-['Poppins',sans-serif] text-[12px] text-gray-400 font-medium">
                                    {notif.time}
                                </span>
                            </div>

                            {/* Unread dot */}
                            {notif.unread && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#006a3f] mt-2"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            &lt;
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                                    currentPage === page
                                        ? "bg-[#006a3f] text-white font-bold"
                                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                } font-['Poppins',sans-serif]`}
                            >
                                {page}
                            </button>
                        ))}

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
