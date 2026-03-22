'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Labourer, WorkerType } from '@/types';
import { WORKER_TYPES } from '@/lib/constants';
import LabourCard from './LabourCard';
import { cn } from '@/lib/utils';

interface LabourListProps {
    labourers: Labourer[];
    onEdit: (labourer: Labourer) => void;
    onDelete: (labourer: Labourer) => void;
}

export default function LabourList({ labourers, onEdit, onDelete }: LabourListProps) {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<WorkerType | 'all'>('all');

    const filtered = labourers.filter((l) => {
        const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || l.worker_type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div>
            {/* Search */}
            <div className="px-4 mb-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                    <Search size={18} className="text-gray-400 flex-shrink-0" />
                    <input
                        id="search-labourers"
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name..."
                        className="flex-1 py-3.5 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="p-1">
                            <X size={16} className="text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filter chips */}
            <div className="px-4 mb-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-1">
                    <button
                        onClick={() => setFilterType('all')}
                        id="filter-all"
                        className={cn(
                            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[36px]',
                            filterType === 'all'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                    >
                        <Filter size={12} />
                        All ({labourers.length})
                    </button>
                    {WORKER_TYPES.map((type) => {
                        const count = labourers.filter((l) => l.worker_type === type).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                id={`filter-${type.toLowerCase()}`}
                                className={cn(
                                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[36px]',
                                    filterType === type
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                            >
                                {type} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* No results */}
            {filtered.length === 0 && (search || filterType !== 'all') && (
                <div className="px-4 py-10 text-center">
                    <p className="text-gray-500 font-medium">No labourers found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
                </div>
            )}

            {/* List */}
            <div className="px-4 space-y-3">
                {filtered.map((labourer) => (
                    <LabourCard
                        key={labourer.id}
                        labourer={labourer}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}
