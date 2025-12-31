import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Clock,
    CloudRain,
    Info,
    Shield,
    SprayCan,
    Sprout,
    ThermometerSun,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

interface Farm {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    plant_id: number;
    plant?: Plant;
}

interface Plant {
    id: number;
    name: string;
    info: string;
    stock: string;
}

interface Spray {
    id: number;
    farm_id: number;
    plant_id: number;
    spray_name: string;
    chemical_name: string;
    purpose: string;
    plant_pest?: string;
    dosage: string;
    application_rate?: string;
    frequency?: string;
    application_date: string;
    season?: string;
    month?: string;
    notes?: string;
}

interface OptimalDate {
    date: string;
    timeOfDay: string;
    reason: string;
    weatherSummary: string;
}

interface AvoidDate {
    date: string;
    reason: string;
}

interface SprayRecommendation {
    recommendation: string;
    optimalDates: OptimalDate[];
    avoidDates: AvoidDate[];
    weatherConsiderations?: string;
    sprayTiming?: string;
    intervalRecommendation?: string;
    seasonalAdvice?: string;
    urgencyLevel: 'high' | 'medium' | 'low';
    safetyNotes?: string;
    resistanceManagement?: string;
    alternativeActions?: string;
}

interface Props {
    farms: Farm[];
    plants: Plant[];
    allSprays: Spray[];
}

export default function SprayRecommendation({
    farms,
    plants,
    allSprays,
}: Props) {
    const [selectedFarmId, setSelectedFarmId] = useState<string>('');
    const [selectedPlantId, setSelectedPlantId] = useState<string>('');
    const [availableSprays, setAvailableSprays] = useState<Spray[]>([]);
    const [selectedSprayId, setSelectedSprayId] = useState<string>('');
    const [selectedSpray, setSelectedSpray] = useState<Spray | null>(null);

    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] =
        useState<SprayRecommendation | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch sprays when plant changes
    const handlePlantChange = async (plantId: string) => {
        setSelectedPlantId(plantId);
        setSelectedSprayId('');
        setSelectedSpray(null);
        setAvailableSprays([]);
        setRecommendation(null);

        if (!plantId) return;

        try {
            console.log('Fetching sprays for plant_id:', plantId);
            const response = await fetch('/sprays/by-plant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ plant_id: plantId }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.success) {
                setAvailableSprays(data.sprays);
            }
        } catch (err) {
            console.error('Error fetching sprays:', err);
        }
    };

    // Handle spray selection
    const handleSpraySelection = (sprayId: string) => {
        setSelectedSprayId(sprayId);
        setRecommendation(null);

        if (!sprayId) {
            setSelectedSpray(null);
            return;
        }

        const spray = availableSprays.find((s) => s.id.toString() === sprayId);
        if (spray) {
            setSelectedSpray(spray);
        }
    };

    const handleGetRecommendation = async () => {
        if (!selectedPlantId || !selectedFarmId || !selectedSprayId) {
            setError('Please select farm, plant, and spray.');
            return;
        }

        setLoading(true);
        setError(null);
        setRecommendation(null);

        try {
            const response = await fetch('/sprays/get-recommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    plant_id: selectedPlantId,
                    farm_id: selectedFarmId,
                    spray_name: selectedSpray?.spray_name,
                    chemical_name: selectedSpray?.chemical_name,
                    purpose: selectedSpray?.purpose,
                    plant_pest: selectedSpray?.plant_pest,
                    dosage: selectedSpray?.dosage,
                    frequency: selectedSpray?.frequency,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get recommendation');
            }

            setRecommendation(data.recommendation);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyColor = (level: string) => {
        switch (level) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'low':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getUrgencyIcon = (level: string) => {
        switch (level) {
            case 'high':
                return <AlertTriangle className="h-4 w-4" />;
            case 'medium':
                return <Clock className="h-4 w-4" />;
            case 'low':
                return <Info className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    return (
        <AppLayout>
            <Head title="Spray Timing Recommendation" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">
                            AI Spray Timing Recommendation
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Get AI recommendations for the best time to apply
                            your sprays
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Input Form */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SprayCan className="h-5 w-5" />
                                Select Spray
                            </CardTitle>
                            <CardDescription>
                                Choose farm, plant, and existing spray record
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="farm">Farm</Label>
                                <Select
                                    value={selectedFarmId}
                                    onValueChange={setSelectedFarmId}
                                >
                                    <SelectTrigger id="farm">
                                        <SelectValue placeholder="Select a farm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {farms.map((farm) => (
                                            <SelectItem
                                                key={farm.id}
                                                value={farm.id.toString()}
                                            >
                                                {farm.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="plant">Plant</Label>
                                <Select
                                    value={selectedPlantId}
                                    onValueChange={handlePlantChange}
                                >
                                    <SelectTrigger id="plant">
                                        <SelectValue placeholder="Select a plant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plants.map((plant) => (
                                            <SelectItem
                                                key={plant.id}
                                                value={plant.id.toString()}
                                            >
                                                {plant.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedPlantId && availableSprays.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label htmlFor="spray">Spray</Label>
                                        <Select
                                            value={selectedSprayId}
                                            onValueChange={handleSpraySelection}
                                        >
                                            <SelectTrigger id="spray">
                                                <SelectValue placeholder="Choose spray from records" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSprays.map(
                                                    (spray) => (
                                                        <SelectItem
                                                            key={spray.id}
                                                            value={spray.id.toString()}
                                                        >
                                                            {spray.spray_name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedSpray && (
                                        <Card className="border-2 bg-muted/30">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm font-medium">
                                                    Spray Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2 text-sm">
                                                <div className="grid grid-cols-3 gap-1">
                                                    <span className="font-semibold text-muted-foreground">
                                                        Name:
                                                    </span>
                                                    <span className="col-span-2">
                                                        {
                                                            selectedSpray.spray_name
                                                        }
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-1">
                                                    <span className="font-semibold text-muted-foreground">
                                                        Chemical:
                                                    </span>
                                                    <span className="col-span-2">
                                                        {
                                                            selectedSpray.chemical_name
                                                        }
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-1">
                                                    <span className="font-semibold text-muted-foreground">
                                                        Purpose:
                                                    </span>
                                                    <span className="col-span-2">
                                                        {selectedSpray.purpose}
                                                    </span>
                                                </div>
                                                {selectedSpray.plant_pest && (
                                                    <div className="grid grid-cols-3 gap-1">
                                                        <span className="font-semibold text-muted-foreground">
                                                            Target:
                                                        </span>
                                                        <span className="col-span-2">
                                                            {
                                                                selectedSpray.plant_pest
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-3 gap-1">
                                                    <span className="font-semibold text-muted-foreground">
                                                        Dosage:
                                                    </span>
                                                    <span className="col-span-2">
                                                        {selectedSpray.dosage}
                                                    </span>
                                                </div>
                                                {selectedSpray.frequency && (
                                                    <div className="grid grid-cols-3 gap-1">
                                                        <span className="font-semibold text-muted-foreground">
                                                            Frequency:
                                                        </span>
                                                        <span className="col-span-2">
                                                            {
                                                                selectedSpray.frequency
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Button
                                        onClick={handleGetRecommendation}
                                        disabled={loading || !selectedSprayId}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {loading
                                            ? 'Analyzing...'
                                            : 'Get AI Recommendation'}
                                    </Button>
                                </>
                            )}

                            {selectedPlantId &&
                                availableSprays.length === 0 && (
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertDescription>
                                            No sprays found for this plant.
                                            Create a spray first in the Sprays
                                            section.
                                        </AlertDescription>
                                    </Alert>
                                )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <div className="space-y-4 lg:col-span-2">
                        {loading && (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                        <div>
                                            <p className="font-medium">
                                                Analyzing...
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                AI is analyzing weather, season,
                                                plant health, and spray history
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {!loading && !recommendation && !error && (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <Sprout className="mx-auto h-16 w-16 text-muted-foreground/50" />
                                    <p className="mt-6 text-lg font-medium">
                                        Ready to Analyze
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Select farm, plant, and spray, then
                                        click "Get AI Recommendation"
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {recommendation && (
                            <>
                                {/* Main Recommendation */}
                                <Card className="border border-border">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                                AI Recommendation
                                            </CardTitle>
                                            <Badge
                                                variant={getUrgencyColor(
                                                    recommendation.urgencyLevel,
                                                )}
                                                className="flex items-center gap-1 px-3 py-1"
                                            >
                                                {getUrgencyIcon(
                                                    recommendation.urgencyLevel,
                                                )}
                                                {recommendation.urgencyLevel.toUpperCase()}{' '}
                                                PRIORITY
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="leading-relaxed">
                                            {recommendation.recommendation}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Optimal Dates */}
                                {recommendation.optimalDates &&
                                    recommendation.optimalDates.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-primary">
                                                    <Calendar className="h-5 w-5" />
                                                    Best Days to Spray
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {recommendation.optimalDates.map(
                                                    (date, index) => (
                                                        <div
                                                            key={index}
                                                            className="space-y-2 rounded-lg border border-border bg-muted/30 p-4"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-lg font-bold text-foreground">
                                                                    {new Date(
                                                                        date.date,
                                                                    ).toLocaleDateString(
                                                                        'en-US',
                                                                        {
                                                                            weekday:
                                                                                'long',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                        },
                                                                    )}
                                                                </div>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-primary text-primary"
                                                                >
                                                                    {
                                                                        date.timeOfDay
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {date.reason}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <CloudRain className="h-3 w-3" />
                                                                {
                                                                    date.weatherSummary
                                                                }
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                {/* Dates to Avoid */}
                                {recommendation.avoidDates &&
                                    recommendation.avoidDates.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-destructive">
                                                    <AlertTriangle className="h-5 w-5" />
                                                    Days to Avoid
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                {recommendation.avoidDates.map(
                                                    (date, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
                                                        >
                                                            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-destructive">
                                                                    {new Date(
                                                                        date.date,
                                                                    ).toLocaleDateString(
                                                                        'en-US',
                                                                        {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                        },
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-destructive/80">
                                                                    {
                                                                        date.reason
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                {/* Additional Info Grid */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    {recommendation.weatherConsiderations && (
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <ThermometerSun className="h-4 w-4" />
                                                    Weather Factors
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        recommendation.weatherConsiderations
                                                    }
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {recommendation.sprayTiming && (
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <Clock className="h-4 w-4" />
                                                    Time of Day
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {recommendation.sprayTiming}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {recommendation.intervalRecommendation && (
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <TrendingUp className="h-4 w-4" />
                                                    Intervals
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        recommendation.intervalRecommendation
                                                    }
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {recommendation.seasonalAdvice && (
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <Sprout className="h-4 w-4" />
                                                    Seasonal Tips
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        recommendation.seasonalAdvice
                                                    }
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Safety */}
                                {(recommendation.safetyNotes ||
                                    recommendation.resistanceManagement) && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Shield className="h-5 w-5" />
                                                Safety & Best Practices
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {recommendation.safetyNotes && (
                                                <div>
                                                    <h4 className="mb-2 font-semibold">
                                                        Safety Notes
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            recommendation.safetyNotes
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {recommendation.resistanceManagement && (
                                                <div>
                                                    <h4 className="mb-2 font-semibold">
                                                        Resistance Management
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            recommendation.resistanceManagement
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {recommendation.alternativeActions && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Info className="h-5 w-5" />
                                                Alternative Options
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    recommendation.alternativeActions
                                                }
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
