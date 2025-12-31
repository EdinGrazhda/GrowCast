import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Calendar,
    CloudRain,
    MapPin,
    SprayCan,
    Sprout,
    TrendingUp,
    Users,
} from 'lucide-react';

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
        totalSprays: number;
        totalUsers: number;
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
                return {
                    bg: 'bg-green-500',
                    light: 'bg-green-50 dark:bg-green-950',
                    text: 'text-green-700 dark:text-green-300',
                };
            case 'acceptable':
                return {
                    bg: 'bg-orange-500',
                    light: 'bg-orange-50 dark:bg-orange-950',
                    text: 'text-orange-700 dark:text-orange-300',
                };
            case 'poor':
                return {
                    bg: 'bg-red-500',
                    light: 'bg-red-50 dark:bg-red-950',
                    text: 'text-red-700 dark:text-red-300',
                };
            default:
                return {
                    bg: 'bg-gray-500',
                    light: 'bg-gray-50 dark:bg-gray-900',
                    text: 'text-gray-700 dark:text-gray-300',
                };
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-primary">
                            Dashboard
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            Overview of your farming operations
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Total Farms */}
                        <Link href="/farms" className="group block">
                            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Farms
                                        </p>
                                        <p className="mt-3 text-4xl font-bold text-primary">
                                            {stats.totalFarms}
                                        </p>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Active locations
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-primary/10 p-3">
                                        <MapPin className="h-7 w-7 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Total Plants */}
                        <Link href="/plants" className="group block">
                            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Plant Types
                                        </p>
                                        <p className="mt-3 text-4xl font-bold text-primary">
                                            {stats.totalPlants}
                                        </p>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Different crops
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-primary/10 p-3">
                                        <Sprout className="h-7 w-7 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Total Sprays */}
                        <Link href="/sprays" className="group block">
                            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Sprays
                                        </p>
                                        <p className="mt-3 text-4xl font-bold text-primary">
                                            {stats.totalSprays}
                                        </p>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Spray applications
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-primary/10 p-3">
                                        <SprayCan className="h-7 w-7 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Weather Forecasts */}
                        <Link href="/weather" className="group block">
                            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Forecasts
                                        </p>
                                        <p className="mt-3 text-4xl font-bold text-primary">
                                            {stats.totalWeatherForecasts}
                                        </p>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            AI recommendations
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-primary/10 p-3">
                                        <CloudRain className="h-7 w-7 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Optimal Days */}
                        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Optimal Days
                                    </p>
                                    <p className="mt-3 text-4xl font-bold text-chart-1">
                                        {stats.optimalDays}
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Best conditions
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-chart-1/20 p-3">
                                    <TrendingUp className="h-7 w-7 text-chart-1" />
                                </div>
                            </div>
                        </div>

                        {/* Total Users (Admin Only) */}
                        {stats.totalUsers > 0 && (
                            <Link href="/users" className="group block">
                                <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Total Users
                                            </p>
                                            <p className="mt-3 text-4xl font-bold text-primary">
                                                {stats.totalUsers}
                                            </p>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Registered users
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-primary/10 p-3">
                                            <Users className="h-7 w-7 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Recent Forecasts and Plant Stock */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Recent Weather Forecasts */}
                        <div className="rounded-lg border border-border bg-card p-6 shadow-md lg:col-span-2">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-primary">
                                    Recent Weather Forecasts
                                </h3>
                                <Link
                                    href="/weather"
                                    className="text-sm font-medium text-primary hover:text-primary/80"
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
                                                className={`block rounded-lg border border-border p-4 transition-colors hover:border-primary/50 ${colors.light}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-primary" />
                                                            <span className="font-semibold text-foreground">
                                                                {
                                                                    forecast.farm_name
                                                                }
                                                            </span>
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${colors.bg}`}
                                                            >
                                                                {forecast.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
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
                                                    <div className="text-xs text-muted-foreground">
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
                                    <CloudRain className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        No weather forecasts yet
                                    </p>
                                    <Link
                                        href="/weather/create"
                                        className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        Create First Forecast
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Plant Stock Overview */}
                        <div className="rounded-lg border border-border bg-card p-6 shadow-md">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-primary">
                                    Plant Stock
                                </h3>
                                <Link
                                    href="/plants"
                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                >
                                    Manage →
                                </Link>
                            </div>

                            {stats.plantsByStock.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.plantsByStock.map((plant, index) => {
                                        const stockColorClass =
                                            plant.stock > 50
                                                ? 'text-chart-1'
                                                : plant.stock > 20
                                                  ? 'text-orange-500'
                                                  : 'text-destructive';
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex flex-1 items-center gap-2">
                                                    <Sprout className="h-4 w-4 text-primary" />
                                                    <span className="text-sm font-medium text-foreground">
                                                        {plant.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-sm font-bold ${stockColorClass}`}
                                                    >
                                                        {plant.stock}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        units
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <Sprout className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        No plants added yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-md">
                        <h3 className="mb-4 text-lg font-semibold text-primary">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <Link
                                href="/farms/create"
                                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
                            >
                                <MapPin className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold text-foreground">
                                        Add New Farm
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Register location
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/plants/create"
                                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
                            >
                                <Sprout className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold text-foreground">
                                        Add New Plant
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Register plant type
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/sprays/create"
                                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
                            >
                                <SprayCan className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold text-foreground">
                                        Add Spray Record
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Log application
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/plant-disease"
                                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
                            >
                                <Activity className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold text-foreground">
                                        Detect Disease
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        AI diagnosis
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/weather/create"
                                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-primary bg-primary/10 p-4 transition-colors hover:bg-primary/20"
                            >
                                <CloudRain className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-semibold text-primary">
                                        Weather Forecast
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        AI recommendations
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
