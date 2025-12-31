import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Farm } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import {
    CloudRain,
    Droplets,
    Gauge,
    Loader2,
    MapPin,
    Sprout,
    Thermometer,
    Wind,
} from 'lucide-react';
import { useState } from 'react';

interface ForecastDay {
    date: string;
    temperature: number;
    humidity: number;
    air_pressure: number;
    wind_speed: number;
    precipitation_probability: number;
    status: string;
    is_best: boolean;
}

interface ForecastData {
    forecast: ForecastDay[];
    recommendation: string;
    status: string;
    best_days: ForecastDay[];
    average_conditions: {
        temperature: number;
        humidity: number;
        air_pressure: number;
        wind_speed: number;
    };
}

export default function Create({ farms }: { farms: Farm[] }) {
    const [selectedFarm, setSelectedFarm] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFarmChange = async (farmId: string) => {
        setSelectedFarm(farmId);
        setForecastData(null);
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post('/weather/forecast', {
                farm_id: farmId,
            });
            setForecastData(response.data);
        } catch (err: any) {
            setError(
                err.response?.data?.error || 'Failed to fetch weather forecast',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!forecastData || !selectedFarm) return;

        const bestDay =
            forecastData.best_days[0]?.date || forecastData.forecast[0]?.date;

        const formData = {
            farm_id: selectedFarm,
            temperature: forecastData.average_conditions.temperature,
            humidity: forecastData.average_conditions.humidity,
            air_pressure: forecastData.average_conditions.air_pressure,
            wind_speed: forecastData.average_conditions.wind_speed,
            status: forecastData.status,
            recommendation: forecastData.recommendation,
            best_planting_day: bestDay,
        };

        router.post('/weather', formData);
    };

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

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'optimal':
                return '/image/Smile.png';
            case 'acceptable':
                return '/image/staying normal.png';
            case 'poor':
                return '/image/sad.png';
            default:
                return '/image/staying normal.png';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const selectedFarmData = farms.find(
        (f) => f.id.toString() === selectedFarm,
    );

    return (
        <AppLayout>
            <Head title="New Weather Forecast" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2
                            className="text-3xl font-bold text-primary"
                        >
                            New Weather Forecast
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            Get AI-powered planting recommendations based on
                            weather conditions
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Farm Selection */}
                        <div className="rounded-lg bg-card p-6 shadow-md">
                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="farm"
                                        className="text-base font-semibold text-primary"
                                    >
                                        Select Farm *
                                    </Label>
                                    <Select
                                        value={selectedFarm}
                                        onValueChange={handleFarmChange}
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Choose a farm..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {farms.map((farm) => (
                                                <SelectItem
                                                    key={farm.id}
                                                    value={farm.id.toString()}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <MapPin
                                                            className="h-4 w-4 text-primary"
                                                        />
                                                        <span className="font-medium">
                                                            {farm.name}
                                                        </span>
                                                        {farm.plant && (
                                                            <span className="text-xs text-muted-foreground">
                                                                (
                                                                {
                                                                    farm.plant
                                                                        .name
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedFarmData && (
                                        <div
                                            className="mt-3 rounded-md p-3 bg-primary/10"
                                        >
                                            <div className="flex items-start gap-3">
                                                <Sprout
                                                    className="mt-0.5 h-5 w-5 text-primary"
                                                />
                                                <div className="flex-1">
                                                    <p
                                                        className="text-sm font-medium text-primary"
                                                    >
                                                        {selectedFarmData.plant
                                                            ?.name ||
                                                            'Unknown Plant'}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {selectedFarmData.description ||
                                                            'No description'}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Location:{' '}
                                                        {Number(
                                                            selectedFarmData.latitude,
                                                        ).toFixed(4)}
                                                        ,{' '}
                                                        {Number(
                                                            selectedFarmData.longitute,
                                                        ).toFixed(4)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="rounded-lg bg-card p-12 shadow-md">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2
                                        className="h-12 w-12 animate-spin text-primary"
                                    />
                                    <p className="font-medium text-muted-foreground">
                                        Fetching weather forecast and generating
                                        AI recommendations...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                                <p className="font-medium text-destructive">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Forecast Results */}
                        {forecastData && !loading && (
                            <>
                                {/* Status Banner */}
                                <div
                                    className="rounded-lg p-6 text-white shadow-md"
                                    style={{
                                        backgroundColor: getStatusColor(
                                            forecastData.status,
                                        ).bg,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <CloudRain className="h-8 w-8" />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold">
                                                {forecastData.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    forecastData.status.slice(
                                                        1,
                                                    )}{' '}
                                                Conditions
                                            </h3>
                                            <p className="mt-1 text-sm opacity-90">
                                                Found{' '}
                                                {forecastData.best_days.length}{' '}
                                                optimal planting days in the
                                                next 40 days
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Average Weather Conditions */}
                                <div className="rounded-lg bg-card p-6 shadow-md">
                                    <h3
                                        className="mb-4 text-lg font-semibold text-primary"
                                    >
                                        Average Weather Conditions (5-Day
                                        Forecast)
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                                            <Thermometer className="h-6 w-6 text-red-500" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Temperature
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {
                                                        forecastData
                                                            .average_conditions
                                                            .temperature
                                                    }
                                                    °C
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                                            <Droplets className="h-6 w-6 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Humidity
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {
                                                        forecastData
                                                            .average_conditions
                                                            .humidity
                                                    }
                                                    %
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                                            <Gauge className="h-6 w-6 text-purple-500" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Pressure
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {
                                                        forecastData
                                                            .average_conditions
                                                            .air_pressure
                                                    }{' '}
                                                    hPa
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                                            <Wind className="h-6 w-6 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Wind Speed
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {
                                                        forecastData
                                                            .average_conditions
                                                            .wind_speed
                                                    }{' '}
                                                    m/s
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Recommendation */}
                                <div className="rounded-lg bg-card p-6 shadow-md">
                                    <h3
                                        className="mb-4 text-lg font-semibold text-primary"
                                    >
                                        AI Recommendation
                                    </h3>
                                    <div className="prose max-w-none">
                                        <p className="leading-relaxed whitespace-pre-line text-foreground">
                                            {forecastData.recommendation}
                                        </p>
                                    </div>
                                </div>

                                {/* Best Days Section */}
                                {forecastData.best_days.length > 0 && (
                                    <div className="rounded-lg bg-card p-6 shadow-md">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3
                                                className="text-lg font-semibold text-primary"
                                            >
                                                🌟 Best Planting Days
                                            </h3>
                                            <span className="text-sm text-muted-foreground">
                                                {forecastData.best_days.length}{' '}
                                                recommended days
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                                            {forecastData.best_days.map(
                                                (day, index) => {
                                                    const colors =
                                                        getStatusColor(
                                                            day.status,
                                                        );
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="relative rounded-lg border-2 p-3 shadow-sm transition-transform hover:scale-105"
                                                            style={{
                                                                backgroundColor:
                                                                    colors.light,
                                                                borderColor:
                                                                    colors.bg,
                                                            }}
                                                        >
                                                            <div className="absolute top-2 right-2">
                                                                <span
                                                                    className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                                                    style={{
                                                                        backgroundColor:
                                                                            colors.bg,
                                                                        color: 'white',
                                                                    }}
                                                                >
                                                                    Best
                                                                </span>
                                                            </div>
                                                            <div className="mb-2 flex flex-col items-center">
                                                                <img
                                                                    src={getStatusIcon(
                                                                        day.status,
                                                                    )}
                                                                    alt={
                                                                        day.status
                                                                    }
                                                                    className="mb-1 h-16 w-16 object-contain"
                                                                />
                                                                <span
                                                                    className="mb-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                                                                    style={{
                                                                        backgroundColor:
                                                                            colors.bg,
                                                                        color: 'white',
                                                                    }}
                                                                >
                                                                    {day.status.toUpperCase()}
                                                                </span>
                                                                <p className="text-[10px] font-medium text-gray-600">
                                                                    Day{' '}
                                                                    {index + 1}
                                                                </p>
                                                                <p
                                                                    className="text-xs font-bold"
                                                                    style={{
                                                                        color: colors.text,
                                                                    }}
                                                                >
                                                                    {formatDate(
                                                                        day.date,
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-2 text-xs">
                                                                <div className="flex items-center gap-1">
                                                                    <Thermometer className="h-3 w-3 text-red-500" />
                                                                    <span className="font-semibold">
                                                                        {
                                                                            day.temperature
                                                                        }
                                                                        °C
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Droplets className="h-3 w-3 text-blue-500" />
                                                                    <span className="font-semibold">
                                                                        {
                                                                            day.humidity
                                                                        }
                                                                        %
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Wind className="h-3 w-3 text-gray-500" />
                                                                    <span className="font-semibold">
                                                                        {
                                                                            day.wind_speed
                                                                        }{' '}
                                                                        m/s
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <CloudRain className="h-3 w-3 text-purple-500" />
                                                                    <span className="font-semibold">
                                                                        {
                                                                            day.precipitation_probability
                                                                        }
                                                                        %
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 40-Day Detailed Forecast */}
                                <div className="rounded-lg bg-card p-6 shadow-md">
                                    <h3
                                        className="mb-4 text-lg font-semibold text-primary"
                                    >
                                        40-Day Weather Forecast
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                                        {forecastData.forecast.map(
                                            (day, index) => {
                                                const colors = getStatusColor(
                                                    day.status,
                                                );
                                                return (
                                                    <div
                                                        key={index}
                                                        className="rounded-lg border p-3 shadow-sm transition-all hover:shadow-md"
                                                        style={{
                                                            backgroundColor:
                                                                colors.light,
                                                            borderColor:
                                                                day.is_best
                                                                    ? colors.bg
                                                                    : '#e5e7eb',
                                                            borderWidth:
                                                                day.is_best
                                                                    ? '2px'
                                                                    : '1px',
                                                        }}
                                                    >
                                                        <div className="mb-2 flex flex-col items-center">
                                                            {day.is_best && (
                                                                <span className="mb-1 text-lg">
                                                                    ⭐
                                                                </span>
                                                            )}
                                                            <img
                                                                src={getStatusIcon(
                                                                    day.status,
                                                                )}
                                                                alt={day.status}
                                                                className="mb-1 h-16 w-16 object-contain"
                                                            />
                                                            <span
                                                                className="mb-1 rounded px-2 py-0.5 text-[9px] font-semibold"
                                                                style={{
                                                                    backgroundColor:
                                                                        colors.bg,
                                                                    color: 'white',
                                                                }}
                                                            >
                                                                {day.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className="mb-2 text-center text-[10px] font-bold"
                                                            style={{
                                                                color: colors.text,
                                                            }}
                                                        >
                                                            {formatDate(
                                                                day.date,
                                                            )}
                                                        </p>
                                                        <div className="space-y-1 text-[11px]">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-600">
                                                                    Temp
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {
                                                                        day.temperature
                                                                    }
                                                                    °C
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-600">
                                                                    Humid
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {
                                                                        day.humidity
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-600">
                                                                    Wind
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {
                                                                        day.wind_speed
                                                                    }{' '}
                                                                    m/s
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-600">
                                                                    Rain
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {
                                                                        day.precipitation_probability
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit('/weather')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        Save Forecast
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
