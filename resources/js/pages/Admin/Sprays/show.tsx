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
                                    className="text-3xl font-bold text-primary"
                                >
                                    {spray.spray_name}
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Spray application details and information
                                </p>
                            </div>
                            <Link href={`/sprays/${spray.id}/edit`}>
                                <Button
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Edit Spray Record
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Spray Information */}
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
                                    Spray Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <label
                                        className="text-sm font-medium text-primary"
                                    >
                                        Spray Name
                                    </label>
                                    <p className="mt-1 text-foreground">
                                        {spray.spray_name}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="text-sm font-medium text-primary"
                                    >
                                        Chemical Name
                                    </label>
                                    <p className="mt-1 text-foreground">
                                        {spray.chemical_name}
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="text-sm font-medium text-primary"
                                    >
                                        Purpose
                                    </label>
                                    <p className="mt-1">
                                        <span
                                            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/20 text-primary"
                                        >
                                            {spray.purpose}
                                        </span>
                                    </p>
                                </div>

                                {spray.plant_pest && (
                                    <div>
                                        <label
                                            className="text-sm font-medium text-primary"
                                        >
                                            Target Pest
                                        </label>
                                        <p className="mt-1 text-foreground">
                                            {spray.plant_pest}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Created: {spray.created_at}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Application Details */}
                        <Card
                            className="border-2 border-primary/20"
                        >
                            <CardHeader
                                className="bg-primary/10"
                            >
                                <CardTitle
                                    className="flex items-center gap-2 text-primary"
                                >
                                    Application Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <label
                                        className="text-sm font-medium text-primary"
                                    >
                                        Dosage
                                    </label>
                                    <p className="mt-1 text-foreground">
                                        {spray.dosage}
                                    </p>
                                </div>

                                {spray.application_rate && (
                                    <div>
                                        <label
                                            className="text-sm font-medium text-primary"
                                        >
                                            Application Rate
                                        </label>
                                        <p className="mt-1 text-foreground">
                                            {spray.application_rate}
                                        </p>
                                    </div>
                                )}

                                {spray.frequency && (
                                    <div>
                                        <label
                                            className="text-sm font-medium text-primary"
                                        >
                                            Frequency
                                        </label>
                                        <p className="mt-1 text-foreground">
                                            {spray.frequency}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label
                                        className="text-sm font-medium text-primary"
                                    >
                                        Application Date
                                    </label>
                                    <p className="mt-1 text-foreground">
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
                                            className="text-sm font-medium text-primary"
                                        >
                                            Season
                                        </label>
                                        <p className="mt-1 text-foreground">
                                            {spray.season}
                                        </p>
                                    </div>
                                )}

                                {spray.month && (
                                    <div>
                                        <label
                                            className="text-sm font-medium text-primary"
                                        >
                                            Month
                                        </label>
                                        <p className="mt-1 text-foreground">
                                            {spray.month}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Farm & Plant Information */}
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
                                    Farm & Plant Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label
                                            className="text-sm font-medium text-primary"
                                        >
                                            Farm
                                        </label>
                                        <Link
                                            href={`/farms/${spray.farm.id}`}
                                            className="mt-1 block"
                                        >
                                            <div
                                                className="rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md border-primary/20"
                                            >
                                                <div
                                                    className="font-semibold text-primary"
                                                >
                                                    {spray.farm.name}
                                                </div>
                                                <div className="mt-1 text-sm text-muted-foreground">
                                                    Lat: {spray.farm.latitude},
                                                    Lng: {spray.farm.longitute}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    <div>
                                        <label
                                            className="text-sm font-medium text-primary"
                                        >
                                            Plant
                                        </label>
                                        <Link
                                            href={`/plants/${spray.plant.id}`}
                                            className="mt-1 block"
                                        >
                                            <div
                                                className="rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md border-primary/20"
                                            >
                                                <div
                                                    className="flex items-center gap-2 font-semibold text-primary"
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
                                className="border-2 md:col-span-2 border-primary/20"
                            >
                                <CardHeader
                                    className="bg-primary/10"
                                >
                                    <CardTitle
                                        className="flex items-center gap-2 text-primary"
                                    >
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <p className="text-foreground">
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
