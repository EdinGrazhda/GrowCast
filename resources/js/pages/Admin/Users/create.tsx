import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

export default function Create({ roles }: { roles: Role[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AppLayout>
            <Head title="Create User" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-primary">
                            Create New User
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            Add a new user to the system
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

                        <div>
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1"
                                required
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation">
                                Confirm Password *
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
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="role">Role (Optional)</Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) =>
                                    setData('role', value)
                                }
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select a role..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.name}
                                        >
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.role}
                                </p>
                            )}
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
                                Create User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
