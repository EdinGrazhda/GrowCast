import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CloudRain, MapPin, Sprout } from 'lucide-react';

interface Farm {
    id: number;
    name: string;
    latitude: number;
    longitute: number;
}

interface Weather {
    id: number;
    temperature: string;
    humidity: string;
    status: string;
    created_at: string;
}

interface Plant {
    id: number;
    name: string;
    stock: number;
    info: string | null;
    farms: Farm[];
    weathers: Weather[];
    created_at: string;
    updated_at: string;
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
        title: 'Details',
        href: '#',
    },
];

export default function Show({ plant }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Plant - ${plant.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-5xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1
                                    className="text-3xl font-bold text-primary"
                                >
                                    {plant.name}
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Plant details and information
                                </p>
                            </div>
                            <Link href={`/plants/${plant.id}/edit`}>
                                <Button
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Edit Plant
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Plant Information */}
                        <Card
                            className="border-2 border-primary/20"
                        >
                            <CardHeader
                                className="bg-primary/10"
                            >
                                <CardTitle
                                    className="flex items-center gap-2 text-primary"
                                >
                                    <Sprout className="h-5 w-5" />
                                    Plant Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <label
                                        className="text-sm font-medium text-primary"
                                    >
                                        Name
                                    </label>
                                    <p className="mt-1 text-foreground">
                                        {plant.name}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="text-sm font-medium text-primary"
                                    >
                                        Stock
                                    </label>
                                    <p className="mt-1">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${plant.stock > 0 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}
                                        >
                                            {plant.stock} units
                                        </span>
                                    </p>
                                </div>

                                {plant.info && (
                                    <div>
                                        <label
                                            className="text-sm font-medium text-primary"
                                        >
                                            Information
                                        </label>
                                        <p className="mt-1 text-foreground">
                                            {plant.info}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Created: {plant.created_at}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistics */}
                        <Card
                            className="border-2 border-primary/20"
                        >
                            <CardHeader
                                className="bg-primary/10"
                            >
                                <CardTitle
                                    className="flex items-center gap-2 text-primary"
                                >
                                    Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            className="h-5 w-5 text-primary"
                                        />
                                        <span className="text-sm font-medium">
                                            Total Farms
                                        </span>
                                    </div>
                                    <span
                                        className="text-2xl font-bold text-primary"
                                    >
                                        {plant.farms.length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CloudRain
                                            className="h-5 w-5 text-primary"
                                        />
                                        <span className="text-sm font-medium">
                                            Weather Records
                                        </span>
                                    </div>
                                    <span
                                        className="text-2xl font-bold text-primary"
                                    >
                                        {plant.weathers.length}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Associated Farms */}
                        {plant.farms.length > 0 && (
                            <Card
                                className="border-2 md:col-span-2 border-primary/20"
                            >
                                <CardHeader
                                    className="bg-primary/10"
                                >
                                    <CardTitle
                                        className="flex items-center gap-2 text-primary"
                                    >
                                        <MapPin className="h-5 w-5" />
                                        Associated Farms
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {plant.farms.map((farm) => (
                                            <Link
                                                key={farm.id}
                                                href={`/farms/${farm.id}`}
                                                className="block"
                                            >
                                                <div
                                                    className="rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md border-primary/20"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <MapPin
                                                            className="h-4 w-4 text-primary"
                                                        />
                                                        <span
                                                            className="font-semibold text-primary"
                                                        >
                                                            {farm.name}
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        {Number(
                                                            farm.latitude,
                                                        ).toFixed(4)}
                                                        ,{' '}
                                                        {Number(
                                                            farm.longitute,
                                                        ).toFixed(4)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="mt-6">
                        <Link href="/plants">
                            <Button
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10"
                            >
                                Back to Plants
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
