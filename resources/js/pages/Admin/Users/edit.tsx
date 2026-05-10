import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

interface UserWithRoles extends User {
    roles: Role[];
}

export default function Edit({
    user,
    roles,
}: {
    user: UserWithRoles;
    roles: Role[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit User" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-primary">
                            Edit User
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            Update user information
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-lg bg-card p-6 shadow-md"
                    >
                        <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="mt-1"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="mt-1"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="rounded-md border border-primary/30 p-4">
                            <p className="mb-3 text-sm font-semibold text-primary">
                                Change Password (Optional)
                            </p>
                            <p className="mb-4 text-xs text-muted-foreground">
                                Leave blank to keep current password
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="password">
                                        New Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Update User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
