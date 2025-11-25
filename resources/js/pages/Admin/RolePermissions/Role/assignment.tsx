import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, Save, X } from 'lucide-react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: string[];
}

interface Props {
    role: Role;
    permissions: Permission[];
}

export default function Assignment({ role, permissions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Roles',
            href: '/roles',
        },
        {
            title: role.name,
            href: `/roles/${role.id}/assignment`,
        },
    ];

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        role.permissions,
    );
    const [saving, setSaving] = useState(false);

    const togglePermission = (permissionName: string) => {
        if (selectedPermissions.includes(permissionName)) {
            setSelectedPermissions(
                selectedPermissions.filter((p) => p !== permissionName),
            );
        } else {
            setSelectedPermissions([...selectedPermissions, permissionName]);
        }
    };

    const toggleCategory = (category: string) => {
        const categoryPermissions = permissions
            .filter((p) => p.name.startsWith(category))
            .map((p) => p.name);

        const allSelected = categoryPermissions.every((p) =>
            selectedPermissions.includes(p),
        );

        if (allSelected) {
            setSelectedPermissions(
                selectedPermissions.filter(
                    (p) => !categoryPermissions.includes(p),
                ),
            );
        } else {
            const newPermissions = [...selectedPermissions];
            categoryPermissions.forEach((p) => {
                if (!newPermissions.includes(p)) {
                    newPermissions.push(p);
                }
            });
            setSelectedPermissions(newPermissions);
        }
    };

    const handleSave = () => {
        setSaving(true);
        router.post(
            `/roles/${role.id}/sync-permissions`,
            {
                permissions: selectedPermissions,
            },
            {
                onFinish: () => setSaving(false),
                onSuccess: () => {
                    router.visit('/roles');
                },
            },
        );
    };

    // Group permissions by category
    const groupedPermissions = permissions.reduce(
        (acc, permission) => {
            const category = permission.name.split('_')[0];
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
        },
        {} as Record<string, Permission[]>,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assign Permissions: ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/roles">
                            <Button
                                variant="ghost"
                                className="mb-4"
                                style={{ color: '#2D6A4F' }}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Roles
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1
                                    className="text-3xl font-bold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Assign Permissions
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Manage permissions for{' '}
                                    <span
                                        className="font-semibold"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        {role.name}
                                    </span>{' '}
                                    role
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">
                                        Selected
                                    </div>
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        {selectedPermissions.length}
                                    </div>
                                </div>
                                <div className="h-12 w-px bg-gray-300"></div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">
                                        Total
                                    </div>
                                    <div className="text-2xl font-bold text-gray-700">
                                        {permissions.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Table */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle style={{ color: '#2D6A4F' }}>
                                Permission Assignment
                            </CardTitle>
                            <CardDescription>
                                Select or deselect permissions by category or
                                individually
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(groupedPermissions).map(
                                    ([category, perms]) => {
                                        const allSelected = perms.every((p) =>
                                            selectedPermissions.includes(
                                                p.name,
                                            ),
                                        );
                                        const someSelected = perms.some((p) =>
                                            selectedPermissions.includes(
                                                p.name,
                                            ),
                                        );

                                        return (
                                            <div
                                                key={category}
                                                className="overflow-hidden rounded-lg border-2"
                                                style={{
                                                    borderColor: '#74C69D40',
                                                }}
                                            >
                                                {/* Category Header */}
                                                <div
                                                    className="flex items-center justify-between px-4 py-3"
                                                    style={{
                                                        backgroundColor:
                                                            allSelected
                                                                ? '#2D6A4F'
                                                                : '#74C69D20',
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                allSelected
                                                            }
                                                            onChange={() =>
                                                                toggleCategory(
                                                                    category,
                                                                )
                                                            }
                                                            className="h-5 w-5 cursor-pointer rounded"
                                                            style={{
                                                                accentColor:
                                                                    '#2D6A4F',
                                                            }}
                                                        />
                                                        <span
                                                            className="text-lg font-bold capitalize"
                                                            style={{
                                                                color: allSelected
                                                                    ? 'white'
                                                                    : '#2D6A4F',
                                                            }}
                                                        >
                                                            {category}
                                                        </span>
                                                        {someSelected &&
                                                            !allSelected && (
                                                                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                                                    Partial
                                                                </span>
                                                            )}
                                                    </div>
                                                    <span
                                                        className="text-sm font-medium"
                                                        style={{
                                                            color: allSelected
                                                                ? 'white'
                                                                : '#2D6A4F',
                                                        }}
                                                    >
                                                        {
                                                            perms.filter((p) =>
                                                                selectedPermissions.includes(
                                                                    p.name,
                                                                ),
                                                            ).length
                                                        }{' '}
                                                        / {perms.length}
                                                    </span>
                                                </div>

                                                {/* Permissions Grid */}
                                                <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
                                                    {perms.map((permission) => {
                                                        const isSelected =
                                                            selectedPermissions.includes(
                                                                permission.name,
                                                            );
                                                        return (
                                                            <label
                                                                key={
                                                                    permission.id
                                                                }
                                                                className="flex cursor-pointer items-center gap-2 rounded-md border-2 p-3 transition-all hover:shadow-md"
                                                                style={{
                                                                    borderColor:
                                                                        isSelected
                                                                            ? '#2D6A4F'
                                                                            : '#74C69D40',
                                                                    backgroundColor:
                                                                        isSelected
                                                                            ? '#74C69D20'
                                                                            : 'transparent',
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        isSelected
                                                                    }
                                                                    onChange={() =>
                                                                        togglePermission(
                                                                            permission.name,
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 cursor-pointer rounded"
                                                                    style={{
                                                                        accentColor:
                                                                            '#2D6A4F',
                                                                    }}
                                                                />
                                                                <span className="flex-1 text-sm font-medium">
                                                                    {
                                                                        permission.name.split(
                                                                            '_',
                                                                        )[1]
                                                                    }
                                                                </span>
                                                                {isSelected && (
                                                                    <Check
                                                                        className="h-4 w-4"
                                                                        style={{
                                                                            color: '#2D6A4F',
                                                                        }}
                                                                    />
                                                                )}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/roles">
                            <Button
                                type="button"
                                variant="outline"
                                style={{
                                    borderColor: '#2D6A4F',
                                    color: '#2D6A4F',
                                }}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="shadow-lg transition-all duration-200 hover:shadow-xl"
                            style={{
                                backgroundColor: '#2D6A4F',
                                color: 'white',
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Permissions'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
