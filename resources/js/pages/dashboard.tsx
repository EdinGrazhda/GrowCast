import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CloudRain, MapPin, Sprout, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        totalFarms: number;
        totalPlants: number;
        totalWeatherForecasts: number;
        optimalDays: number;
        recentForecasts: Array<{
            id: number;
            farm_name: string;
            plant_name: string;
            status: string;
            best_planting_day: string;
            created_at: string;
        }>;
        plantsByStock: Array<{
            name: string;
            stock: number;
        }>;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'optimal':
                return { bg: '#22c55e', light: '#dcfce7', text: '#166534' };
            case 'acceptable':
                return { bg: '#f97316', light: '#ffedd5', text: '#9a3412' };
            case 'poor':
                return { bg: '#ef4444', light: '#fee2e2', text: '#991b1b' };
            default:
                return { bg: '#6b7280', light: '#f3f4f6', text: '#374151' };
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2
                            className="text-3xl font-bold"
                            style={{ color: '#2D6A4F' }}
                        >
                            Dashboard
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Overview of your farming operations
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Farms */}
                        <Link href="/farms" className="block">
                            <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Farms
                                        </p>
                                        <p
                                            className="mt-2 text-3xl font-bold"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            {stats.totalFarms}
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-full p-3"
                                        style={{ backgroundColor: '#74C69D30' }}
                                    >
                                        <MapPin
                                            className="h-8 w-8"
                                            style={{ color: '#2D6A4F' }}
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-gray-500">
                                    Active farming locations
                                </p>
                            </div>
                        </Link>

                        {/* Total Plants */}
                        <Link href="/plants" className="block">
                            <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Plant Types
                                        </p>
                                        <p
                                            className="mt-2 text-3xl font-bold"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            {stats.totalPlants}
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-full p-3"
                                        style={{ backgroundColor: '#74C69D30' }}
                                    >
                                        <Sprout
                                            className="h-8 w-8"
                                            style={{ color: '#2D6A4F' }}
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-gray-500">
                                    Different crops available
                                </p>
                            </div>
                        </Link>

                        {/* Weather Forecasts */}
                        <Link href="/weather" className="block">
                            <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Forecasts
                                        </p>
                                        <p
                                            className="mt-2 text-3xl font-bold"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            {stats.totalWeatherForecasts}
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-full p-3"
                                        style={{ backgroundColor: '#74C69D30' }}
                                    >
                                        <CloudRain
                                            className="h-8 w-8"
                                            style={{ color: '#2D6A4F' }}
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-gray-500">
                                    AI recommendations created
                                </p>
                            </div>
                        </Link>

                        {/* Optimal Days */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Optimal Days
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-green-600">
                                        {stats.optimalDays}
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <TrendingUp className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-gray-500">
                                Best planting conditions found
                            </p>
                        </div>
                    </div>

                    {/* Recent Forecasts and Plant Stock */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Recent Weather Forecasts */}
                        <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
                            <div className="mb-6 flex items-center justify-between">
                                <h3
                                    className="text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Recent Weather Forecasts
                                </h3>
                                <Link
                                    href="/weather"
                                    className="text-sm font-medium"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    View All →
                                </Link>
                            </div>

                            {stats.recentForecasts.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentForecasts.map((forecast) => {
                                        const colors = getStatusColor(
                                            forecast.status,
                                        );
                                        return (
                                            <Link
                                                key={forecast.id}
                                                href={`/weather/${forecast.id}`}
                                                className="block rounded-lg border p-4 transition-colors hover:border-gray-300"
                                                style={{
                                                    backgroundColor:
                                                        colors.light,
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <MapPin
                                                                className="h-4 w-4"
                                                                style={{
                                                                    color: '#2D6A4F',
                                                                }}
                                                            />
                                                            <span className="font-semibold text-gray-900">
                                                                {
                                                                    forecast.farm_name
                                                                }
                                                            </span>
                                                            <span
                                                                className="rounded-full px-2 py-0.5 text-xs font-medium"
                                                                style={{
                                                                    backgroundColor:
                                                                        colors.bg,
                                                                    color: 'white',
                                                                }}
                                                            >
                                                                {forecast.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <Sprout className="h-3 w-3" />
                                                                {
                                                                    forecast.plant_name
                                                                }
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                Best:{' '}
                                                                {
                                                                    forecast.best_planting_day
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(
                                                            forecast.created_at,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <CloudRain className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                    <p className="text-gray-600">
                                        No weather forecasts yet
                                    </p>
                                    <Link
                                        href="/weather/create"
                                        className="mt-4 inline-block rounded-lg px-4 py-2 font-medium text-white"
                                        style={{ backgroundColor: '#2D6A4F' }}
                                    >
                                        Create First Forecast
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Plant Stock Overview */}
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-6 flex items-center justify-between">
                                <h3
                                    className="text-lg font-semibold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Plant Stock
                                </h3>
                                <Link
                                    href="/plants"
                                    className="text-sm font-medium"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Manage →
                                </Link>
                            </div>

                            {stats.plantsByStock.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.plantsByStock.map((plant, index) => {
                                        const stockColor =
                                            plant.stock > 50
                                                ? '#22c55e'
                                                : plant.stock > 20
                                                  ? '#f97316'
                                                  : '#ef4444';
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex flex-1 items-center gap-2">
                                                    <Sprout
                                                        className="h-4 w-4"
                                                        style={{
                                                            color: '#2D6A4F',
                                                        }}
                                                    />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {plant.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="text-sm font-bold"
                                                        style={{
                                                            color: stockColor,
                                                        }}
                                                    >
                                                        {plant.stock}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        units
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Sprout className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                                    <p className="text-sm text-gray-600">
                                        No plants added yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
                        <h3
                            className="mb-4 text-lg font-semibold"
                            style={{ color: '#2D6A4F' }}
                        >
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Link
                                href="/farms/create"
                                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-gray-400"
                            >
                                <MapPin
                                    className="h-6 w-6"
                                    style={{ color: '#2D6A4F' }}
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        Add New Farm
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Register a new location
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/plants/create"
                                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-gray-400"
                            >
                                <Sprout
                                    className="h-6 w-6"
                                    style={{ color: '#2D6A4F' }}
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        Add New Plant
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Register plant type
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/weather/create"
                                className="flex items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors"
                                style={{
                                    borderColor: '#2D6A4F',
                                    backgroundColor: '#74C69D20',
                                }}
                            >
                                <CloudRain
                                    className="h-6 w-6"
                                    style={{ color: '#2D6A4F' }}
                                />
                                <div>
                                    <p
                                        className="font-semibold"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Get Weather Forecast
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        AI planting recommendations
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
