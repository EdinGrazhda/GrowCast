import MapViewer from '@/components/map-viewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, MapPin, Sprout, User } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Plant {
    id: number;
    name: string;
    stock: number;
    info: string;
}

interface Farm {
    id: number;
    name: string;
    description: string | null;
    longitute: number;
    latitude: number;
    user_id: number;
    plant_id: number;
    user: User;
    plant: Plant;
    created_at: string;
    updated_at: string;
}

interface Props {
    farm: Farm;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Farms',
        href: '/farms',
    },
    {
        title: 'Details',
        href: '#',
    },
];

export default function Show({ farm }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Farm - ${farm.name}`} />

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
                                    {farm.name}
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Farm details and information
                                </p>
                            </div>
                            <Link href={`/farms/${farm.id}/edit`}>
                                <Button
                                    style={{
                                        backgroundColor: '#2D6A4F',
                                        color: 'white',
                                    }}
                                >
                                    Edit Farm
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Farm Information */}
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
                                    <MapPin className="h-5 w-5" />
                                    Farm Information
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
                                        {farm.name}
                                    </p>
                                </div>

                                {farm.description && (
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Description
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {farm.description}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Location
                                    </label>
                                    <div className="mt-1 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                                            Lat: {farm.latitude.toFixed(6)},
                                            Lng: {farm.longitute.toFixed(6)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Created: {farm.created_at}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Owner Information */}
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
                                    <User className="h-5 w-5" />
                                    Owner Information
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
                                        {farm.user.name}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Email
                                    </label>
                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                        {farm.user.email}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Plant Information */}
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
                                    <Sprout className="h-5 w-5" />
                                    Plant Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Plant Name
                                        </label>
                                        <p className="mt-1">
                                            <span
                                                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                                                style={{
                                                    backgroundColor:
                                                        '#74C69D30',
                                                    color: '#2D6A4F',
                                                }}
                                            >
                                                {farm.plant.name}
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Stock
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {farm.plant.stock} units
                                        </p>
                                    </div>

                                    <div className="md:col-span-3">
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Information
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {farm.plant.info ||
                                                'No information available'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Map View */}
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
                                    Farm Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <MapViewer
                                    latitude={farm.latitude}
                                    longitude={farm.longitute}
                                    farmName={farm.name}
                                    height="400px"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6">
                        <Link href="/farms">
                            <Button
                                variant="outline"
                                style={{
                                    borderColor: '#74C69D',
                                    color: '#2D6A4F',
                                }}
                            >
                                Back to Farms
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
