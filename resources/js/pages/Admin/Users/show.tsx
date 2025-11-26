import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Mail, Shield, User as UserIcon } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface RoleWithPermissions extends Role {
    permissions: Permission[];
}

interface UserWithRoles extends User {
    roles: RoleWithPermissions[];
}

export default function Show({ user }: { user: UserWithRoles }) {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2
                                className="text-3xl font-bold"
                                style={{ color: '#2D6A4F' }}
                            >
                                User Details
                            </h2>
                            <p className="mt-1 text-gray-600">
                                View user information and assigned roles
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/users/${user.id}/assign-role`}>
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    style={{
                                        borderColor: '#2D6A4F',
                                        color: '#2D6A4F',
                                    }}
                                >
                                    <Shield className="h-4 w-4" />
                                    Manage Roles
                                </Button>
                            </Link>
                            <Link href={`/users/${user.id}/edit`}>
                                <Button
                                    className="gap-2"
                                    style={{ backgroundColor: '#2D6A4F' }}
                                >
                                    Edit User
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* User Profile Card */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="flex items-center gap-6">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                                    <span
                                        className="text-4xl font-bold"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {user.name}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2 text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{user.email}</span>
                                    </div>
                                    {user.email_verified_at && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Email verified on{' '}
                                                {formatDate(
                                                    user.email_verified_at,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Roles Card */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-2">
                                <Shield
                                    className="h-5 w-5"
                                    style={{ color: '#2D6A4F' }}
                                />
                                <h3
                                    className="text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Assigned Roles
                                </h3>
                            </div>

                            {user.roles.length === 0 ? (
                                <div
                                    className="rounded-md p-4 text-center"
                                    style={{ backgroundColor: '#f3f4f6' }}
                                >
                                    <p className="text-sm text-gray-500">
                                        No roles assigned to this user
                                    </p>
                                    <Link
                                        href={`/users/${user.id}/assign-role`}
                                    >
                                        <Button
                                            className="mt-3"
                                            size="sm"
                                            style={{
                                                backgroundColor: '#2D6A4F',
                                            }}
                                        >
                                            Assign Roles
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {user.roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="mb-3 flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-white ${getRoleBadgeColor(role.name)}`}
                                                >
                                                    <Shield className="h-4 w-4" />
                                                    {role.name}
                                                </span>
                                            </div>

                                            {role.permissions.length > 0 && (
                                                <div>
                                                    <p className="mb-2 text-xs font-medium text-gray-600">
                                                        Permissions:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {role.permissions.map(
                                                            (permission) => (
                                                                <span
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                                                                >
                                                                    {
                                                                        permission.name
                                                                    }
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Account Information */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center gap-2">
                                <UserIcon
                                    className="h-5 w-5"
                                    style={{ color: '#2D6A4F' }}
                                />
                                <h3
                                    className="text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Account Information
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        User ID
                                    </p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        #{user.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Account Created
                                    </p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {formatDate(user.created_at)}
                                    </p>
                                </div>
                                {user.updated_at && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Last Updated
                                        </p>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {formatDate(user.updated_at)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/users">
                                <Button variant="outline">Back to Users</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
