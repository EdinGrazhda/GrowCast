import MapViewer from '@/components/map-viewer';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Farm, Plant, Weather } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CloudRain,
    Droplets,
    Gauge,
    MapPin,
    Sprout,
    Thermometer,
    Wind,
} from 'lucide-react';

interface WeatherWithRelations extends Weather {
    farm: Farm;
    plant: Plant;
}

export default function Show({ weather }: { weather: WeatherWithRelations }) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'optimal':
                return { bg: '#22c55e', light: '#dcfce7' };
            case 'acceptable':
                return { bg: '#f97316', light: '#ffedd5' };
            case 'poor':
                return { bg: '#ef4444', light: '#fee2e2' };
            default:
                return { bg: '#6b7280', light: '#f3f4f6' };
        }
    };

    const statusColors = getStatusColor(weather.status);

    return (
        <AppLayout>
            <Head title={`Weather Forecast - ${weather.farm.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link href="/weather">
                            <Button
                                variant="ghost"
                                className="mb-4 -ml-2 gap-2"
                                style={{ color: '#2D6A4F' }}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Weather Forecasts
                            </Button>
                        </Link>
                        <div className="flex items-start justify-between">
                            <div>
                                <h2
                                    className="text-3xl font-bold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    {weather.farm.name}
                                </h2>
                                <p className="mt-1 text-gray-600">
                                    Weather Forecast Details
                                </p>
                            </div>
                            <span
                                className="rounded-full px-4 py-2 text-sm font-semibold text-white"
                                style={{ backgroundColor: statusColors.bg }}
                            >
                                {weather.status.charAt(0).toUpperCase() +
                                    weather.status.slice(1)}{' '}
                                Conditions
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Farm and Plant Information */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Farm Details */}
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h3
                                    className="mb-4 flex items-center gap-2 text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    <MapPin className="h-5 w-5" />
                                    Farm Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Farm Name
                                        </p>
                                        <p className="font-semibold">
                                            {weather.farm.name}
                                        </p>
                                    </div>
                                    {weather.farm.description && (
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Description
                                            </p>
                                            <p className="text-gray-700">
                                                {weather.farm.description}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Location
                                        </p>
                                        <p className="font-mono text-sm">
                                            {Number(
                                                weather.farm.latitude,
                                            ).toFixed(4)}
                                            ,{' '}
                                            {Number(
                                                weather.farm.longitute,
                                            ).toFixed(4)}
                                        </p>
                                    </div>
                                    {weather.farm.user && (
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Owner
                                            </p>
                                            <p className="font-semibold">
                                                {weather.farm.user.name}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Map */}
                                <div className="mt-4 overflow-hidden rounded-lg border">
                                    <MapViewer
                                        latitude={Number(weather.farm.latitude)}
                                        longitude={Number(
                                            weather.farm.longitute,
                                        )}
                                        height="200px"
                                    />
                                </div>
                            </div>

                            {/* Plant Details */}
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h3
                                    className="mb-4 flex items-center gap-2 text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    <Sprout className="h-5 w-5" />
                                    Plant Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Plant Name
                                        </p>
                                        <p className="font-semibold">
                                            {weather.plant.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Stock Available
                                        </p>
                                        <p className="font-semibold">
                                            {weather.plant.stock} units
                                        </p>
                                    </div>
                                    {weather.plant.info && (
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Plant Information
                                            </p>
                                            <p className="text-gray-700">
                                                {weather.plant.info}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Best Planting Day */}
                        {weather.best_planting_day && (
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h3
                                    className="mb-4 flex items-center gap-2 text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    <Calendar className="h-5 w-5" />
                                    Recommended Planting Date
                                </h3>
                                <div
                                    className="rounded-lg p-4 text-center"
                                    style={{
                                        backgroundColor: statusColors.light,
                                    }}
                                >
                                    <p className="mb-1 text-sm text-gray-600">
                                        Best day to plant
                                    </p>
                                    <p
                                        className="text-2xl font-bold"
                                        style={{ color: statusColors.bg }}
                                    >
                                        {weather.best_planting_day}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Weather Metrics */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3
                                className="mb-4 flex items-center gap-2 text-lg font-semibold"
                                style={{ color: '#2D6A4F' }}
                            >
                                <CloudRain className="h-5 w-5" />
                                Weather Conditions
                            </h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="flex items-center gap-3 rounded-md bg-gray-50 p-4">
                                    <Thermometer className="h-8 w-8 text-red-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Temperature
                                        </p>
                                        <p className="text-xl font-bold">
                                            {weather.temperature}°C
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-md bg-gray-50 p-4">
                                    <Droplets className="h-8 w-8 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Humidity
                                        </p>
                                        <p className="text-xl font-bold">
                                            {weather.humidity}%
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-md bg-gray-50 p-4">
                                    <Gauge className="h-8 w-8 text-purple-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Air Pressure
                                        </p>
                                        <p className="text-xl font-bold">
                                            {weather.air_pressure} hPa
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-md bg-gray-50 p-4">
                                    <Wind className="h-8 w-8 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Wind Speed
                                        </p>
                                        <p className="text-xl font-bold">
                                            {weather.wind_speed} m/s
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Recommendation */}
                        {weather.recommendation && (
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h3
                                    className="mb-4 text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    AI Recommendation
                                </h3>
                                <div
                                    className="rounded-lg p-6"
                                    style={{
                                        backgroundColor: statusColors.light,
                                    }}
                                >
                                    <p className="leading-relaxed whitespace-pre-line text-gray-800">
                                        {weather.recommendation}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h3
                                className="mb-4 text-lg font-semibold"
                                style={{ color: '#2D6A4F' }}
                            >
                                Record Information
                            </h3>
                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                <div>
                                    <p className="text-gray-500">Created At</p>
                                    <p className="font-medium">
                                        {new Date(
                                            weather.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">
                                        Last Updated
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            weather.updated_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
