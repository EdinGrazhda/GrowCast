import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Loader2, Pencil, Plus, Sprout, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Farm {
    id: number;
    name: string;
}

interface Plant {
    id: number;
    name: string;
}

interface Spray {
    id: number;
    spray_name: string;
    chemical_name: string;
    purpose: string;
    plant_pest: string | null;
    dosage: string;
    application_rate: string | null;
    frequency: string | null;
    application_date: string;
    season: string | null;
    month: string | null;
    notes: string | null;
    farm: Farm;
    plant: Plant;
    created_at: string;
}

interface Props {
    sprays: Spray[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Sprays',
        href: '/sprays',
    },
];

export default function Index({ sprays }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the spray "${name}"?`)) {
            setDeletingId(id);
            router.delete(`/sprays/${id}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sprays Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1
                                    className="text-3xl font-bold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Sprays Management
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage spray applications and pest control
                                    records
                                </p>
                            </div>
                            <Link href="/sprays/create">
                                <Button
                                    className="shadow-lg transition-all duration-200 hover:shadow-xl"
                                    style={{
                                        backgroundColor: '#2D6A4F',
                                        color: 'white',
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Spray Record
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Sprays Table */}
                    <Card
                        className="mb-8 overflow-hidden border-2"
                        style={{ borderColor: '#74C69D40' }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead style={{ backgroundColor: '#2D6A4F' }}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Spray Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Plant
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Farm
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Purpose
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Application Date
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {sprays.map((spray, index) => (
                                        <tr
                                            key={spray.id}
                                            className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                            style={{
                                                backgroundColor:
                                                    index % 2 === 0
                                                        ? 'transparent'
                                                        : '#74C69D08',
                                            }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="flex h-10 w-10 items-center justify-center rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                '#74C69D30',
                                                        }}
                                                    >
                                                        <Sprout
                                                            className="h-5 w-5"
                                                            style={{
                                                                color: '#2D6A4F',
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="font-semibold"
                                                            style={{
                                                                color: '#2D6A4F',
                                                            }}
                                                        >
                                                            {spray.spray_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {
                                                                spray.chemical_name
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {spray.plant.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {spray.farm.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                                                    style={{
                                                        backgroundColor:
                                                            '#74C69D30',
                                                        color: '#2D6A4F',
                                                    }}
                                                >
                                                    {spray.purpose}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(
                                                    spray.application_date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/sprays/${spray.id}`}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            style={{
                                                                borderColor:
                                                                    '#74C69D',
                                                                color: '#2D6A4F',
                                                            }}
                                                            className="transition-all duration-200 hover:bg-[#74C69D] hover:text-white"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/sprays/${spray.id}/edit`}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            style={{
                                                                borderColor:
                                                                    '#2D6A4F',
                                                                color: '#2D6A4F',
                                                            }}
                                                            className="transition-all duration-200 hover:bg-[#2D6A4F] hover:text-white"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDelete(
                                                                spray.id,
                                                                spray.spray_name,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            spray.id
                                                        }
                                                        className="border-red-500 text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
                                                    >
                                                        {deletingId ===
                                                        spray.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Empty State */}
                    {sprays.length === 0 && (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <Sprout
                                    className="mx-auto mb-4 h-16 w-16"
                                    style={{ color: '#74C69D' }}
                                />
                                <h3
                                    className="mb-2 text-xl font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    No spray records found
                                </h3>
                                <p className="mb-6 text-gray-600 dark:text-gray-400">
                                    Get started by creating your first spray
                                    record
                                </p>
                                <Link href="/sprays/create">
                                    <Button
                                        style={{
                                            backgroundColor: '#2D6A4F',
                                            color: 'white',
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Spray Record
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
