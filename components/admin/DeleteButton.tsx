'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteButton({ slug }: { slug: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this movie? This cannot be undone.')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/movies/${slug}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete movie');
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
            alert('Error deleting movie');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-red-500/10 rounded-full text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
            title="Delete Movie"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
