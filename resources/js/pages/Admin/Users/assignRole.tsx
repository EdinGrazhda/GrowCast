import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Shield, UserCog } from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface UserWithRoles extends User {
    roles: Role[];
}

export default function AssignRole({
    user,
    roles,
}: {
    user: UserWithRoles;
    roles: Role[];
}) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        user.roles.map((role) => role.name),
    );

    const handleToggleRole = (roleName: string) => {
        setSelectedRoles((prev) =>
            prev.includes(roleName)
                ? prev.filter((r) => r !== roleName)
                : [...prev, roleName],
        );
    };

    const handleSyncRoles = () => {
        router.post(`/users/${user.id}/sync-roles`, {
            roles: selectedRoles,
        });
    };

    const getRoleBadgeColor = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'admin':
                return 'bg-purple-500';
            case 'farmer':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <AppLayout>
            <Head title="Assign Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2
                            className="text-3xl font-bold"
                            style={{ color: '#2D6A4F' }}
                        >
                            Manage User Roles
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Assign or remove roles for {user.name}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* User Info Card */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {user.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${getRoleBadgeColor(role.name)}`}
                                                >
                                                    <Shield className="h-3 w-3" />
                                                    {role.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">
                                                No roles assigned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role Selection Card */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-2">
                                <UserCog
                                    className="h-5 w-5"
                                    style={{ color: '#2D6A4F' }}
                                />
                                <h3
                                    className="text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Available Roles
                                </h3>
                            </div>

                            {roles.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No roles available. Please create roles
                                    first.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="flex items-center gap-3 rounded-md border p-4 transition-colors hover:bg-gray-50"
                                        >
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={selectedRoles.includes(
                                                    role.name,
                                                )}
                                                onCheckedChange={() =>
                                                    handleToggleRole(role.name)
                                                }
                                            />
                                            <Label
                                                htmlFor={`role-${role.id}`}
                                                className="flex flex-1 cursor-pointer items-center gap-2"
                                            >
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white ${getRoleBadgeColor(role.name)}`}
                                                >
                                                    <Shield className="h-3 w-3" />
                                                    {role.name}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div
                                className="mt-6 rounded-md p-4"
                                style={{ backgroundColor: '#74C69D20' }}
                            >
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    💡 Role Information
                                </p>
                                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                                    <li>
                                        • <strong>Admin:</strong> Full system
                                        access and management
                                    </li>
                                    <li>
                                        • <strong>Farmer:</strong> Manage farms,
                                        plants, and weather forecasts
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/users')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSyncRoles}
                                style={{ backgroundColor: '#2D6A4F' }}
                            >
                                Save Roles
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
