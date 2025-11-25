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
                                    className="text-3xl font-bold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    {plant.name}
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Plant details and information
                                </p>
                            </div>
                            <Link href={`/plants/${plant.id}/edit`}>
                                <Button
                                    style={{
                                        backgroundColor: '#2D6A4F',
                                        color: 'white',
                                    }}
                                >
                                    Edit Plant
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Plant Information */}
                        <Card
                            className="border-2"
                            style={{ borderColor: '#74C69D40' }}
                        >
                            <CardHeader
                                style={{ backgroundColor: '#74C69D10' }}
                            >
                                <CardTitle
                                    className="flex items-center gap-2"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    <Sprout className="h-5 w-5" />
                                    Plant Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Name
                                    </label>
                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                        {plant.name}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Stock
                                    </label>
                                    <p className="mt-1">
                                        <span
                                            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                                            style={{
                                                backgroundColor:
                                                    plant.stock > 0
                                                        ? '#74C69D30'
                                                        : '#ef444420',
                                                color:
                                                    plant.stock > 0
                                                        ? '#2D6A4F'
                                                        : '#ef4444',
                                            }}
                                        >
                                            {plant.stock} units
                                        </span>
                                    </p>
                                </div>

                                {plant.info && (
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Information
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {plant.info}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Created: {plant.created_at}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistics */}
                        <Card
                            className="border-2"
                            style={{ borderColor: '#74C69D40' }}
                        >
                            <CardHeader
                                style={{ backgroundColor: '#74C69D10' }}
                            >
                                <CardTitle
                                    className="flex items-center gap-2"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            className="h-5 w-5"
                                            style={{ color: '#2D6A4F' }}
                                        />
                                        <span className="text-sm font-medium">
                                            Total Farms
                                        </span>
                                    </div>
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        {plant.farms.length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CloudRain
                                            className="h-5 w-5"
                                            style={{ color: '#2D6A4F' }}
                                        />
                                        <span className="text-sm font-medium">
                                            Weather Records
                                        </span>
                                    </div>
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        {plant.weathers.length}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Associated Farms */}
                        {plant.farms.length > 0 && (
                            <Card
                                className="border-2 md:col-span-2"
                                style={{ borderColor: '#74C69D40' }}
                            >
                                <CardHeader
                                    style={{ backgroundColor: '#74C69D10' }}
                                >
                                    <CardTitle
                                        className="flex items-center gap-2"
                                        style={{ color: '#2D6A4F' }}
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
                                                    className="rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md"
                                                    style={{
                                                        borderColor:
                                                            '#74C69D40',
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <MapPin
                                                            className="h-4 w-4"
                                                            style={{
                                                                color: '#2D6A4F',
                                                            }}
                                                        />
                                                        <span
                                                            className="font-semibold"
                                                            style={{
                                                                color: '#2D6A4F',
                                                            }}
                                                        >
                                                            {farm.name}
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        {farm.latitude.toFixed(
                                                            4,
                                                        )}
                                                        ,{' '}
                                                        {farm.longitute.toFixed(
                                                            4,
                                                        )}
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
                                style={{
                                    borderColor: '#74C69D',
                                    color: '#2D6A4F',
                                }}
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
