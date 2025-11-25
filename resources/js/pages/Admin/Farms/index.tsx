import MapViewer from '@/components/map-viewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Loader2, MapPin, Pencil, Plus, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Plant {
    id: number;
    name: string;
    stock: number;
    info: string;
}

interface Farm {
    id: number;
    name: string;
    description: string | null;
    longitute: string | number;
    latitude: string | number;
    user_id: number;
    plant_id: number;
    user: User;
    plant: Plant;
    created_at: string;
}

interface Props {
    farms: Farm[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Farms',
        href: '/farms',
    },
];

export default function Index({ farms }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the farm "${name}"?`)) {
            setDeletingId(id);
            router.delete(`/farms/${id}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Farms Management" />

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
                                    Farms Management
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage farms and their locations
                                </p>
                            </div>
                            <Link href="/farms/create">
                                <Button
                                    className="shadow-lg transition-all duration-200 hover:shadow-xl"
                                    style={{
                                        backgroundColor: '#2D6A4F',
                                        color: 'white',
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Farm
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Farms Grid */}
                    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {farms.map((farm) => (
                            <Card
                                key={farm.id}
                                className="overflow-hidden border-2 transition-all duration-200 hover:shadow-lg"
                                style={{ borderColor: '#74C69D40' }}
                            >
                                {/* Map Preview */}
                                <div className="relative h-48">
                                    <MapViewer
                                        latitude={Number(farm.latitude)}
                                        longitude={Number(farm.longitute)}
                                        farmName={farm.name}
                                        height="100%"
                                    />
                                </div>

                                {/* Card Content */}
                                <CardContent className="p-6">
                                    {/* Farm Name */}
                                    <div className="mb-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <MapPin
                                                className="h-5 w-5"
                                                style={{ color: '#2D6A4F' }}
                                            />
                                            <h3
                                                className="text-lg font-semibold"
                                                style={{ color: '#2D6A4F' }}
                                            >
                                                {farm.name}
                                            </h3>
                                        </div>
                                        {farm.description && (
                                            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                {farm.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Owner Info */}
                                    <div className="mb-3 flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {farm.user.name}
                                            </span>
                                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                                                {farm.user.email}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Plant Badge */}
                                    <div className="mb-4">
                                        <span
                                            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                                            style={{
                                                backgroundColor: '#74C69D30',
                                                color: '#2D6A4F',
                                            }}
                                        >
                                            {farm.plant.name}
                                        </span>
                                    </div>

                                    {/* Location */}
                                    <div className="mb-4 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <MapPin className="h-3 w-3" />
                                        <span>
                                            {Number(farm.latitude).toFixed(4)},{' '}
                                            {Number(farm.longitute).toFixed(4)}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <Link
                                            href={`/farms/${farm.id}`}
                                            className="flex-1"
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full transition-all duration-200 hover:bg-[#74C69D] hover:text-white"
                                                style={{
                                                    borderColor: '#74C69D',
                                                    color: '#2D6A4F',
                                                }}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                        <Link
                                            href={`/farms/${farm.id}/edit`}
                                            className="flex-1"
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full transition-all duration-200 hover:bg-[#2D6A4F] hover:text-white"
                                                style={{
                                                    borderColor: '#2D6A4F',
                                                    color: '#2D6A4F',
                                                }}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleDelete(farm.id, farm.name)
                                            }
                                            disabled={deletingId === farm.id}
                                            className="border-red-500 text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
                                        >
                                            {deletingId === farm.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {farms.length === 0 && (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <MapPin
                                    className="mx-auto mb-4 h-16 w-16"
                                    style={{ color: '#74C69D' }}
                                />
                                <h3
                                    className="mb-2 text-xl font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    No farms found
                                </h3>
                                <p className="mb-6 text-gray-600 dark:text-gray-400">
                                    Get started by creating your first farm
                                </p>
                                <Link href="/farms/create">
                                    <Button
                                        style={{
                                            backgroundColor: '#2D6A4F',
                                            color: 'white',
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Farm
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
