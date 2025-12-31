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
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEvent } from 'react';

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
        title: 'Create',
        href: '/roles/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/roles');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/roles">
                            <Button
                                variant="ghost"
                                className="mb-4 text-primary"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Roles
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-primary">
                            Create New Role
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Define a new role and assign permissions
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Role Name */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-primary">
                                    Role Information
                                </CardTitle>
                                <CardDescription>
                                    Enter the basic details for the role
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-primary">
                                        Role Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={`w-full rounded-lg border-2 px-4 py-2 transition-all focus:ring-2 focus:ring-primary focus:outline-none ${
                                            errors.name ? 'border-destructive' : 'border-primary/60'
                                        }`}
                                        placeholder="Enter role name"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4">
                            <Link href="/roles">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-primary text-primary"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-70"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Creating...' : 'Create Role'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
