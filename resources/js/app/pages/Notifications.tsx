import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { FileText, CheckCircle2, Truck, Bell } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';

export default function Notifications() {
    const { auth } = usePage().props as any;
    const userId = auth?.user?.id;
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        // Fetch initial notifications
        axios.get('/api/notifications').then((res) => {
            const mappedNotifs = res.data.map((n: any) => ({
                id: n.id,
                type: n.data.type || n.type,
                title: n.data.title || 'Notifikasi Baru',
                desc: n.data.message,
                time: new Date(n.created_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                icon: (n.data.type === 'order_entered' || n.data.type === 'shipping') ? <Truck size={24} className="text-current" /> : <FileText size={24} className="text-current" />,
                unread: n.read_at === null,
                data: n.data
            }));
            setNotifications(mappedNotifs);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));

        // Set up Echo listener
        if (window.Echo) {
            window.Echo.private(`App.Models.User.${userId}`)
                .notification((notification: any) => {
                    setNotifications(prev => [{
                        id: notification.id,
                        type: notification.type,
                        title: notification.title || 'Notifikasi Baru',
                        desc: notification.message,
                        time: 'Baru saja',
                        icon: (notification.type === 'order_entered' || notification.type === 'shipping') ? <Truck size={24} className="text-current" /> : <FileText size={24} className="text-current" />,
                        unread: true,
                        data: notification
                    }, ...prev]);
                    
                    // Dispatch event for Header badge
                    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
                });
        }

        return () => {
            if (window.Echo) {
                window.Echo.leave(`App.Models.User.${userId}`);
            }
        };
    }, [userId]);

    const handleNotificationClick = async (notif: any) => {
        if (notif.unread) {
            try {
                await axios.patch(`/api/notifications/${notif.id}/read`);
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                window.dispatchEvent(new CustomEvent('notificationsUpdated'));
            } catch (e) {
                console.error("Failed to mark as read", e);
            }
        }
    };

    const markAllRead = async () => {
        const unreadNotifs = notifications.filter(n => n.unread);
        if (unreadNotifs.length === 0) return;
        
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
            window.dispatchEvent(new CustomEvent('notificationsUpdated'));
            
            // Send requests
            await Promise.all(unreadNotifs.map(n => axios.patch(`/api/notifications/${n.id}/read`)));
        } catch (e) {
            console.error("Failed to mark all as read", e);
        }
    };

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
                        onClick={markAllRead}
                        disabled={notifications.length === 0 || !notifications.some(n => n.unread)}
                        className={`font-['Poppins',sans-serif] text-[14px] font-bold transition-opacity ${
                            notifications.length === 0 || !notifications.some(n => n.unread) 
                                ? 'text-gray-400 cursor-not-allowed opacity-50' 
                                : 'text-[#1e5b53] hover:underline'
                        }`}
                    >
                        Tandai semua telah dibaca
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e5b53]"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-80">
                        <Bell className="text-gray-300 w-20 h-20 mb-4" />
                        <p className="text-gray-500 font-['Poppins',sans-serif] text-lg text-center">Wah, belum ada notifikasi baru buat kamu. Yuk, cek katalog kami sekarang!</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-12">
                            {paginatedNotifications.map(notif => (
                                <Link 
                                    href={notif.data?.url || '#'}
                                    key={notif.id} 
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`relative flex items-start gap-6 p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                        notif.unread 
                                            ? 'border-transparent bg-white shadow-sm hover:shadow-md' 
                                            : 'border-gray-200 bg-gray-50 opacity-80 hover:opacity-100'
                                    }`}
                                >
                                    {/* Unread indicator bar */}
                                    {notif.unread && (
                                        <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#1e5b53] rounded-r-md"></div>
                                    )}

                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                                        notif.unread ? 'bg-emerald-50 text-[#1e5b53]' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {notif.icon}
                                    </div>

                                    <div className="flex-1 pt-1">
                                        <h3 className={`font-['Poppins',sans-serif] font-bold text-[18px] mb-1 ${
                                            notif.unread ? 'text-[#171d19]' : 'text-gray-600'
                                        }`}>
                                            {notif.title}
                                        </h3>
                                        <p className={`font-['Poppins',sans-serif] text-[14px] mb-2 leading-relaxed ${
                                            notif.unread ? 'text-gray-600' : 'text-gray-500'
                                        }`}>
                                            {notif.desc}
                                        </p>
                                        <span className={`font-['Poppins',sans-serif] text-[12px] font-medium ${
                                            notif.unread ? 'text-[#1e5b53]' : 'text-gray-400'
                                        }`}>
                                            {notif.time}
                                        </span>
                                    </div>

                                    {/* Unread dot */}
                                    {notif.unread && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#1e5b53] mt-2 shadow-[0_0_8px_rgba(30,91,83,0.6)]"></div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
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
                                                ? "bg-[#1e5b53] text-white font-bold"
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
                    </>
                )}
            </main>
        </div>
    );
}
