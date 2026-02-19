'use client';

import { CastMember } from '@/lib/types';
import { User } from 'lucide-react';
import Image from 'next/image';

interface CastListProps {
    cast: CastMember[];
}

export function CastList({ cast }: CastListProps) {
    if (!cast || cast.length === 0) return null;

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-4">
                {cast.map((member) => (
                    <div key={member.name} className="flex-shrink-0 w-32 flex flex-col items-center text-center group">
                        <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden bg-gray-800 border-2 border-white/10 group-hover:border-accent transition-colors">
                            {member.imageUrl ? (
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <User className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-200 mb-1 leading-tight">{member.name}</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
