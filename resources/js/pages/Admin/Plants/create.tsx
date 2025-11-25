import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2, Sprout } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Plants',
        href: '/plants',
    },
    {
        title: 'Create',
        href: '/plants/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        stock: '',
        info: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/plants');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Plant" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1
                                    className="text-3xl font-bold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Create New Plant
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Add a new plant to the system
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <Card
                        className="border-2"
                        style={{ borderColor: '#74C69D40' }}
                    >
                        <CardHeader style={{ backgroundColor: '#74C69D10' }}>
                            <CardTitle
                                className="flex items-center gap-2"
                                style={{ color: '#2D6A4F' }}
                            >
                                <Sprout className="h-5 w-5" />
                                Plant Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Plant Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="Enter plant name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="stock"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Stock *
                                    </Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) =>
                                            setData('stock', e.target.value)
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="Enter stock quantity"
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-red-500">
                                            {errors.stock}
                                        </p>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="info"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Information
                                    </Label>
                                    <Textarea
                                        id="info"
                                        value={data.info}
                                        onChange={(e) =>
                                            setData('info', e.target.value)
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="Enter plant information"
                                        rows={4}
                                    />
                                    {errors.info && (
                                        <p className="text-sm text-red-500">
                                            {errors.info}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4 pt-4">
                                    <Link href="/plants">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            style={{
                                                borderColor: '#74C69D',
                                                color: '#2D6A4F',
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            backgroundColor: '#2D6A4F',
                                            color: 'white',
                                        }}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Plant'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
