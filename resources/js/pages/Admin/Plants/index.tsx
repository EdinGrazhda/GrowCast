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
                                <h1 className="text-3xl font-bold text-primary">
                                    Plants Management
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Manage plants and their inventory
                                </p>
                            </div>
                            <Link href="/plants/create">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all duration-200 hover:shadow-xl">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Plant
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Plants Table */}
                    <Card className="mb-8 overflow-hidden border-2 border-primary/20">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-primary">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">
                                            Plant Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">
                                            Stock
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">
                                            Farms
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">
                                            Weather Records
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-primary-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {plants.map((plant, index) => (
                                        <tr
                                            key={plant.id}
                                            className={`transition-colors hover:bg-muted/50 ${index % 2 === 1 ? 'bg-primary/5' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                                                        <Sprout className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-primary">
                                                            {plant.name}
                                                        </div>
                                                        {plant.info && (
                                                            <div className="text-xs text-muted-foreground">
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
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${plant.stock > 0 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}
                                                >
                                                    {plant.stock} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {plant.farms_count} farm(s)
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
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
                                                            className="border-primary text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
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
                                                            className="border-primary text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
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
                                                        className="border-destructive text-destructive transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
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
                        <Card className="bg-card py-12 text-center">
                            <CardContent>
                                <Sprout className="mx-auto mb-4 h-16 w-16 text-primary/60" />
                                <h3 className="mb-2 text-xl font-semibold text-primary">
                                    No plants found
                                </h3>
                                <p className="mb-6 text-muted-foreground">
                                    Get started by creating your first plant
                                </p>
                                <Link href="/plants/create">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
