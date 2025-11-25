import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Loader2, Pencil, Plus, Sprout, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Plant {
    id: number;
    name: string;
    stock: number;
    info: string | null;
    farms_count: number;
    weathers_count: number;
    created_at: string;
}

interface Props {
    plants: Plant[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Plants',
        href: '/plants',
    },
];

export default function Index({ plants }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the plant "${name}"?`)) {
            setDeletingId(id);
            router.delete(`/plants/${id}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Plants Management" />

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
                                    Plants Management
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage plants and their inventory
                                </p>
                            </div>
                            <Link href="/plants/create">
                                <Button
                                    className="shadow-lg transition-all duration-200 hover:shadow-xl"
                                    style={{
                                        backgroundColor: '#2D6A4F',
                                        color: 'white',
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Plant
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Plants Table */}
                    <Card
                        className="mb-8 overflow-hidden border-2"
                        style={{ borderColor: '#74C69D40' }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead style={{ backgroundColor: '#2D6A4F' }}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Plant Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Stock
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Farms
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Weather Records
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {plants.map((plant, index) => (
                                        <tr
                                            key={plant.id}
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
                                                            {plant.name}
                                                        </div>
                                                        {plant.info && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {plant.info
                                                                    .length > 50
                                                                    ? plant.info.slice(
                                                                          0,
                                                                          50,
                                                                      ) + '...'
                                                                    : plant.info}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                                                    style={{
                                                        backgroundColor:
                                                            plant.stock > 0
                                                                ? '#74C69D30'
                                                                : '#ef444420',
                                                        color:
                                                            plant.stock > 0
                                                                ? '#2D6A4F'
                                                                : '#ef4444',
                                                    }}
                                                >
                                                    {plant.stock} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {plant.farms_count} farm(s)
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {plant.weathers_count} record(s)
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/plants/${plant.id}`}
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
                                                        href={`/plants/${plant.id}/edit`}
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
                                                                plant.id,
                                                                plant.name,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            plant.id
                                                        }
                                                        className="border-red-500 text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
                                                    >
                                                        {deletingId ===
                                                        plant.id ? (
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
                    {plants.length === 0 && (
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
                                    No plants found
                                </h3>
                                <p className="mb-6 text-gray-600 dark:text-gray-400">
                                    Get started by creating your first plant
                                </p>
                                <Link href="/plants/create">
                                    <Button
                                        style={{
                                            backgroundColor: '#2D6A4F',
                                            color: 'white',
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Plant
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
