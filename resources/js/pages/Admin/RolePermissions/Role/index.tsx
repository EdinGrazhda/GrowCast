import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Loader2,
    Pencil,
    Plus,
    Settings,
    ShieldAlert,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions_count: number;
    permissions: string[];
    created_at: string;
}

interface Props {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({ roles }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete the role "${name}"?`)) {
            setDeletingId(id);
            router.delete(`/roles/${id}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Management" />

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
                                    Roles Management
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage system roles and their permissions
                                </p>
                            </div>
                            <Link href="/roles/create">
                                <Button
                                    className="shadow-lg transition-all duration-200 hover:shadow-xl"
                                    style={{
                                        backgroundColor: '#2D6A4F',
                                        color: 'white',
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Role
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Roles Table */}
                    <Card
                        className="mb-8 overflow-hidden border-2"
                        style={{ borderColor: '#74C69D40' }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead style={{ backgroundColor: '#2D6A4F' }}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Role Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Permissions Count
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Created Date
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {roles.data.map((role, index) => (
                                        <tr
                                            key={role.id}
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
                                                        <ShieldAlert
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
                                                            {role.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {role.permissions
                                                                .slice(0, 2)
                                                                .join(', ')}
                                                            {role.permissions
                                                                .length > 2 &&
                                                                '...'}
                                                        </div>
                                                    </div>
                                                </div>
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
                                                    {role.permissions_count}{' '}
                                                    permissions
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {role.created_at}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/roles/${role.id}/assignment`}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            style={{
                                                                borderColor:
                                                                    '#74C69D',
                                                                color: '#2D6A4F',
                                                            }}
                                                            className="hover:bg-green-50"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/roles/${role.id}/edit`}
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
                                                                role.id,
                                                                role.name,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                                role.id ||
                                                            role.name ===
                                                                'admin'
                                                        }
                                                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                    >
                                                        {deletingId ===
                                                        role.id ? (
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
                    {roles.data.length === 0 && (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <ShieldAlert
                                    className="mx-auto mb-4 h-16 w-16"
                                    style={{ color: '#74C69D' }}
                                />
                                <h3
                                    className="mb-2 text-xl font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    No roles found
                                </h3>
                                <p className="mb-6 text-gray-600 dark:text-gray-400">
                                    Get started by creating your first role
                                </p>
                                <Link href="/roles/create">
                                    <Button
                                        style={{
                                            backgroundColor: '#2D6A4F',
                                            color: 'white',
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Role
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {roles.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {roles.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        link.url && router.visit(link.url)
                                    }
                                    disabled={!link.url}
                                    className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'shadow-md'
                                            : 'hover:shadow-md'
                                    }`}
                                    style={{
                                        backgroundColor: link.active
                                            ? '#2D6A4F'
                                            : 'white',
                                        color: link.active
                                            ? 'white'
                                            : '#2D6A4F',
                                        border: `2px solid ${link.active ? '#2D6A4F' : '#74C69D'}`,
                                        opacity: !link.url ? 0.5 : 1,
                                        cursor: !link.url
                                            ? 'not-allowed'
                                            : 'pointer',
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
