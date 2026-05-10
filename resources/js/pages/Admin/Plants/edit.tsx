import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2, Sprout } from 'lucide-react';

interface Plant {
    id: number;
    name: string;
    stock: number;
    info: string | null;
}

interface Props {
    plant: Plant;
}

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
        title: 'Edit',
        href: '#',
    },
];

export default function Edit({ plant }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: plant.name || '',
        stock: plant.stock.toString() || '',
        info: plant.info || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/plants/${plant.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Plant - ${plant.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1
                                    className="text-3xl font-bold text-primary"
                                >
                                    Edit Plant
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Update plant information
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <Card
                        className="border-2 border-primary/20"
                    >
                        <CardHeader className="bg-primary/10">
                            <CardTitle
                                className="flex items-center gap-2 text-primary"
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
                                        className="text-primary"
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
                                        className="focus:border-primary focus:ring-primary"
                                        placeholder="Enter plant name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="stock"
                                        className="text-primary"
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
                                        className="focus:border-primary focus:ring-primary"
                                        placeholder="Enter stock quantity"
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-destructive">
                                            {errors.stock}
                                        </p>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="info"
                                        className="text-primary"
                                    >
                                        Information
                                    </Label>
                                    <Textarea
                                        id="info"
                                        value={data.info}
                                        onChange={(e) =>
                                            setData('info', e.target.value)
                                        }
                                        className="focus:border-primary focus:ring-primary"
                                        placeholder="Enter plant information"
                                        rows={4}
                                    />
                                    {errors.info && (
                                        <p className="text-sm text-destructive">
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
                                            className="border-primary text-primary hover:bg-primary/10"
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Plant'
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
