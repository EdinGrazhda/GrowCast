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
                                <h1 className="text-3xl font-bold text-primary">
                                    Roles Management
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Manage system roles and their permissions
                                </p>
                            </div>
                            <Link href="/roles/create">
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all duration-200 hover:shadow-xl">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Role
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Roles Table */}
                    <Card className="mb-8 overflow-hidden border-2 border-primary/20">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-primary">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">
                                            Role Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">
                                            Permissions Count
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">
                                            Created Date
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-primary-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {roles.data.map((role, index) => (
                                        <tr
                                            key={role.id}
                                            className={`transition-colors hover:bg-muted/50 ${index % 2 === 0 ? '' : 'bg-primary/5'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                                                        <ShieldAlert className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-primary">
                                                            {role.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
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
                                                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/20 text-primary">
                                                    {role.permissions_count}{' '}
                                                    permissions
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
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
                                                            className="border-primary/60 text-primary hover:bg-primary/10"
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
                                                        className="border-destructive text-destructive hover:bg-destructive/10"
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
                                <ShieldAlert className="mx-auto mb-4 h-16 w-16 text-primary/60" />
                                <h3 className="mb-2 text-xl font-semibold text-primary">
                                    No roles found
                                </h3>
                                <p className="mb-6 text-muted-foreground">
                                    Get started by creating your first role
                                </p>
                                <Link href="/roles/create">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                                    className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 border-2 ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                            : 'bg-card text-primary border-primary/60 hover:shadow-md'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
