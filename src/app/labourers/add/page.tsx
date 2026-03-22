'use client';

import { useRouter } from 'next/navigation';
import LabourForm from '@/components/labour/LabourForm';
import { useLabourers } from '@/hooks/useLabourers';
import PageHeader from '@/components/layout/PageHeader';
import BottomNav from '@/components/layout/BottomNav';
import toast from 'react-hot-toast';

export default function AddLabourerPage() {
    const router = useRouter();
    const { addLabourer } = useLabourers();

    const handleAdd = async (data: Parameters<typeof addLabourer>[0]) => {
        try {
            await addLabourer(data);
            toast.success('Labourer added successfully!');
            router.push('/labourers');
        } catch {
            toast.error('Failed to add labourer');
            throw new Error('Failed to add labourer');
        }
    };

    return (
        <div className="page-container">
            <PageHeader title="Add New Labourer" showBack backHref="/labourers" />

            <div className="px-4 py-6 max-w-lg mx-auto">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-6 font-medium">
                        Fill in worker details to add them to your site team. All fields marked with * are required.
                    </p>
                    <LabourForm onSubmit={handleAdd} submitLabel="Add Labourer" />
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
