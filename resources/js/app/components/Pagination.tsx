import { Link } from '@inertiajs/react';
import React from 'react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    className?: string;
}

export default function Pagination({ links, className = '' }: PaginationProps) {
    if (!links || links.length <= 3) return null; // Only prev, next, and 1 page

    return (
        <div className={`flex flex-wrap items-center justify-center gap-1 ${className}`}>
            {links.map((link, index) => {
                const isPrevious = link.label.includes('Previous');
                const isNext = link.label.includes('Next');

                let label = link.label;
                if (isPrevious) label = '«';
                if (isNext) label = '»';

                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="px-3 py-1.5 text-sm text-slate-400 border border-transparent rounded-lg cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all border ${
                            link.active
                                ? 'bg-[#0D6A36] text-white border-[#0D6A36] shadow-sm font-semibold'
                                : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300'
                        }`}
                        preserveState
                        preserveScroll
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </div>
    );
}
