import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Shield, Trash2, UserCog } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface UserWithRoles extends User {
    roles: Role[];
}

export default function Index({ users }: { users: UserWithRoles[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${id}`);
        }
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
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2
                                className="text-3xl font-bold"
                                style={{ color: '#2D6A4F' }}
                            >
                                Users
                            </h2>
                            <p className="mt-1 text-gray-600">
                                Manage system users and their roles
                            </p>
                        </div>
                        <Link href="/users/create">
                            <Button
                                className="gap-2"
                                style={{ backgroundColor: '#2D6A4F' }}
                            >
                                <Plus className="h-4 w-4" />
                                Add User
                            </Button>
                        </Link>
                    </div>

                    {users.length === 0 ? (
                        <div className="rounded-lg bg-white p-12 text-center shadow-md">
                            <UserCog className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-xl font-semibold text-gray-700">
                                No users yet
                            </h3>
                            <p className="mb-6 text-gray-500">
                                Get started by creating your first user
                            </p>
                            <Link href="/users/create">
                                <Button style={{ backgroundColor: '#2D6A4F' }}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create First User
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg bg-white shadow-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Roles
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                        <span
                                                            className="text-sm font-semibold"
                                                            style={{
                                                                color: '#2D6A4F',
                                                            }}
                                                        >
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length > 0 ? (
                                                        user.roles.map(
                                                            (role) => (
                                                                <span
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${getRoleBadgeColor(role.name)}`}
                                                                >
                                                                    <Shield className="h-3 w-3" />
                                                                    {role.name}
                                                                </span>
                                                            ),
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            No role assigned
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/users/${user.id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1"
                                                            style={{
                                                                borderColor:
                                                                    '#2D6A4F',
                                                                color: '#2D6A4F',
                                                            }}
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/users/${user.id}/assign-role`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1"
                                                            style={{
                                                                borderColor:
                                                                    '#2D6A4F',
                                                                color: '#2D6A4F',
                                                            }}
                                                        >
                                                            <Shield className="h-3 w-3" />
                                                            Roles
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/users/${user.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            style={{
                                                                borderColor:
                                                                    '#2D6A4F',
                                                                color: '#2D6A4F',
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
