import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Farm, Plant, Weather } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    CloudRain,
    Droplets,
    Eye,
    Gauge,
    Plus,
    Thermometer,
    Trash2,
    Wind,
} from 'lucide-react';

interface WeatherWithRelations extends Weather {
    farm: Farm;
    plant: Plant;
}

export default function Index({
    weathers,
}: {
    weathers: WeatherWithRelations[];
}) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'optimal':
                return 'bg-green-500';
            case 'acceptable':
                return 'bg-orange-500';
            case 'poor':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'optimal':
                return '/image/Smile.png';
            case 'acceptable':
                return '/image/normal.png';
            case 'poor':
                return '/image/crying.png';
            default:
                return '/image/normal.png';
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this weather record?')) {
            router.delete(`/weather/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Weather Forecasts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2
                                className="text-3xl font-bold"
                                style={{ color: '#2D6A4F' }}
                            >
                                Weather Forecasts
                            </h2>
                            <p className="mt-1 text-gray-600">
                                AI-powered planting recommendations
                            </p>
                        </div>
                        <Link href="/weather/create">
                            <Button
                                className="gap-2"
                                style={{ backgroundColor: '#2D6A4F' }}
                            >
                                <Plus className="h-4 w-4" />
                                New Forecast
                            </Button>
                        </Link>
                    </div>

                    {weathers.length === 0 ? (
                        <div className="rounded-lg bg-white p-12 text-center shadow-md">
                            <CloudRain className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-xl font-semibold text-gray-700">
                                No weather forecasts yet
                            </h3>
                            <p className="mb-6 text-gray-500">
                                Get started by creating your first weather
                                forecast
                            </p>
                            <Link href="/weather/create">
                                <Button style={{ backgroundColor: '#2D6A4F' }}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create First Forecast
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {weathers.map((weather) => (
                                <div
                                    key={weather.id}
                                    className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                                >
                                    {/* Header with Status Badge */}
                                    <div
                                        className="border-b p-4"
                                        style={{ backgroundColor: '#f8f9fa' }}
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3
                                                    className="text-lg font-bold"
                                                    style={{ color: '#2D6A4F' }}
                                                >
                                                    {weather.farm.name}
                                                </h3>
                                                <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                                                    <CloudRain className="h-3 w-3" />
                                                    {weather.plant.name}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <img
                                                    src={getStatusIcon(
                                                        weather.status,
                                                    )}
                                                    alt={weather.status}
                                                    className="h-20 w-20 object-contain"
                                                />
                                                <span
                                                    className={`${getStatusColor(weather.status)} rounded-full px-3 py-1 text-xs font-medium text-white`}
                                                >
                                                    {weather.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        weather.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weather Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4 p-4">
                                        <div className="flex items-center gap-2">
                                            <Thermometer className="h-4 w-4 text-red-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Temperature
                                                </p>
                                                <p className="font-semibold">
                                                    {weather.temperature}°C
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Droplets className="h-4 w-4 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Humidity
                                                </p>
                                                <p className="font-semibold">
                                                    {weather.humidity}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Gauge className="h-4 w-4 text-purple-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Pressure
                                                </p>
                                                <p className="font-semibold">
                                                    {weather.air_pressure} hPa
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Wind className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Wind
                                                </p>
                                                <p className="font-semibold">
                                                    {weather.wind_speed} m/s
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Best Planting Day */}
                                    {weather.best_planting_day && (
                                        <div className="px-4 pb-4">
                                            <div
                                                className="rounded-md p-3"
                                                style={{
                                                    backgroundColor:
                                                        '#74C69D20',
                                                }}
                                            >
                                                <p
                                                    className="text-xs font-medium"
                                                    style={{ color: '#2D6A4F' }}
                                                >
                                                    Best Planting Day
                                                </p>
                                                <p
                                                    className="mt-1 text-sm font-bold"
                                                    style={{ color: '#2D6A4F' }}
                                                >
                                                    {weather.best_planting_day}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommendation Excerpt */}
                                    {weather.recommendation && (
                                        <div className="px-4 pb-4">
                                            <p className="mb-1 text-xs text-gray-500">
                                                AI Recommendation:
                                            </p>
                                            <p className="line-clamp-2 text-sm text-gray-700">
                                                {weather.recommendation}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 px-4 pb-4">
                                        <Link
                                            href={`/weather/${weather.id}`}
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full gap-2"
                                                style={{
                                                    borderColor: '#2D6A4F',
                                                    color: '#2D6A4F',
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="border-red-500 text-red-500 hover:bg-red-50"
                                            onClick={() =>
                                                handleDelete(weather.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
