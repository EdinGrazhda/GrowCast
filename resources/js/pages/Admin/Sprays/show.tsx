import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, MapPin, Sprout } from 'lucide-react';

interface Farm {
    id: number;
    name: string;
    latitude: number;
    longitute: number;
}

interface Plant {
    id: number;
    name: string;
}

interface Spray {
    id: number;
    spray_name: string;
    chemical_name: string;
    purpose: string;
    plant_pest: string | null;
    dosage: string;
    application_rate: string | null;
    frequency: string | null;
    application_date: string;
    season: string | null;
    month: string | null;
    notes: string | null;
    farm: Farm;
    plant: Plant;
    created_at: string;
    updated_at: string;
}

interface Props {
    spray: Spray;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Sprays',
        href: '/sprays',
    },
    {
        title: 'Details',
        href: '#',
    },
];

export default function Show({ spray }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Spray - ${spray.spray_name}`} />

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
                                    {spray.spray_name}
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Spray application details and information
                                </p>
                            </div>
                            <Link href={`/sprays/${spray.id}/edit`}>
                                <Button
                                    style={{
                                        backgroundColor: '#2D6A4F',
                                        color: 'white',
                                    }}
                                >
                                    Edit Spray Record
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Spray Information */}
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
                                    Spray Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Spray Name
                                    </label>
                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                        {spray.spray_name}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Chemical Name
                                    </label>
                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                        {spray.chemical_name}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Purpose
                                    </label>
                                    <p className="mt-1">
                                        <span
                                            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                                            style={{
                                                backgroundColor: '#74C69D30',
                                                color: '#2D6A4F',
                                            }}
                                        >
                                            {spray.purpose}
                                        </span>
                                    </p>
                                </div>

                                {spray.plant_pest && (
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Target Pest
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {spray.plant_pest}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Created: {spray.created_at}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Application Details */}
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
                                    Application Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Dosage
                                    </label>
                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                        {spray.dosage}
                                    </p>
                                </div>

                                {spray.application_rate && (
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Application Rate
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {spray.application_rate}
                                        </p>
                                    </div>
                                )}

                                {spray.frequency && (
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Frequency
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {spray.frequency}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label
                                        className="text-sm font-medium"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Application Date
                                    </label>
                                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                                        {new Date(
                                            spray.application_date,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>

                                {spray.season && (
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Season
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {spray.season}
                                        </p>
                                    </div>
                                )}

                                {spray.month && (
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Month
                                        </label>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                                            {spray.month}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Farm & Plant Information */}
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
                                    Farm & Plant Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Farm
                                        </label>
                                        <Link
                                            href={`/farms/${spray.farm.id}`}
                                            className="mt-1 block"
                                        >
                                            <div
                                                className="rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md"
                                                style={{
                                                    borderColor: '#74C69D40',
                                                }}
                                            >
                                                <div
                                                    className="font-semibold"
                                                    style={{ color: '#2D6A4F' }}
                                                >
                                                    {spray.farm.name}
                                                </div>
                                                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    Lat: {spray.farm.latitude},
                                                    Lng: {spray.farm.longitute}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    <div>
                                        <label
                                            className="text-sm font-medium"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Plant
                                        </label>
                                        <Link
                                            href={`/plants/${spray.plant.id}`}
                                            className="mt-1 block"
                                        >
                                            <div
                                                className="rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md"
                                                style={{
                                                    borderColor: '#74C69D40',
                                                }}
                                            >
                                                <div
                                                    className="flex items-center gap-2 font-semibold"
                                                    style={{ color: '#2D6A4F' }}
                                                >
                                                    <Sprout className="h-4 w-4" />
                                                    {spray.plant.name}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {spray.notes && (
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
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {spray.notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
