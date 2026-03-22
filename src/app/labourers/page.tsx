'use client';

import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Labourer } from '@/types';
import { useLabourers } from '@/hooks/useLabourers';
import LabourList from '@/components/labour/LabourList';
import LabourForm from '@/components/labour/LabourForm';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import PageHeader from '@/components/layout/PageHeader';
import BottomNav from '@/components/layout/BottomNav';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LabourersPage() {
    const { labourers, loading, updateLabourer, deleteLabourer } = useLabourers();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedLabourer, setSelectedLabourer] = useState<Labourer | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Labourer | null>(null);

    const handleEdit = (labourer: Labourer) => {
        setSelectedLabourer(labourer);
        setIsEditing(true);
    };

    const handleDeleteRequest = (labourer: Labourer) => {
        setDeleteTarget(labourer);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteLabourer(deleteTarget.id);
            toast.success(`${deleteTarget.name} removed`);
        } catch {
            toast.error('Failed to delete labourer');
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleUpdate = async (data: Parameters<typeof updateLabourer>[1]) => {
        if (!selectedLabourer) return;
        try {
            await updateLabourer(selectedLabourer.id, data);
            toast.success('Labourer updated!');
            setIsEditing(false);
            setSelectedLabourer(null);
        } catch {
            toast.error('Failed to update labourer');
            throw new Error('Failed to update labourer');
        }
    };

    const closeDrawer = () => {
        setIsEditing(false);
        setSelectedLabourer(null);
    };

    return (
        <div className="page-container">
            <PageHeader
                title="Labourers"
                subtitle={labourers.length > 0 ? `${labourers.length} active workers` : undefined}
                action={
                    <Link
                        href="/labourers/add"
                        id="add-labourer-btn"
                        className="flex items-center gap-2 py-2.5 px-4 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors min-h-[44px]"
                    >
                        <Plus size={18} />
                        Add
                    </Link>
                }
            />

            <div className="pt-4 pb-6">
                {loading ? (
                    <div className="px-4">
                        <LoadingSkeleton count={4} />
                    </div>
                ) : labourers.length === 0 ? (
                    <EmptyState
                        icon={<Users size={48} />}
                        title="No Labourers Yet"
                        description="Start by adding your first labourer. You can track their attendance once they're added."
                        action={
                            <Link
                                href="/labourers/add"
                                id="empty-add-labourer-btn"
                                className="block w-full py-4 px-6 bg-indigo-600 text-white font-semibold rounded-2xl text-center hover:bg-indigo-700 transition-colors min-h-[56px] flex items-center justify-center"
                            >
                                Add First Labourer
                            </Link>
                        }
                    />
                ) : (
                    <LabourList labourers={labourers} onEdit={handleEdit} onDelete={handleDeleteRequest} />
                )}
            </div>

            {/* Edit Drawer */}
            {isEditing && (
                <div
                    className="fixed inset-0 z-50 flex items-end"
                    onClick={(e) => e.target === e.currentTarget && closeDrawer()}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDrawer} />
                    <div className="relative w-full bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[92dvh] overflow-y-auto">
                        {/* Handle */}
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />

                        <div className="px-4 pb-8">
                            <div className="flex items-center justify-between py-4 mb-2">
                                <h2 className="text-xl font-bold text-gray-900">Edit Labourer</h2>
                                <button
                                    onClick={closeDrawer}
                                    id="close-drawer-btn"
                                    className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <LabourForm
                                key={selectedLabourer?.id}
                                initialData={selectedLabourer || undefined}
                                onSubmit={handleUpdate}
                                submitLabel="Save Changes"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Labourer"
                message={`Are you sure you want to delete ${deleteTarget?.name}? This cannot be undone.`}
                confirmLabel="Yes, Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />

            <BottomNav />
        </div>
    );
}
