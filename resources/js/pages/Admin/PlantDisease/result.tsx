import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    ArrowLeft,
    Leaf,
    Lightbulb,
    MapPin,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Plant Disease Detection',
        href: '/plant-disease',
    },
    {
        title: 'Results',
        href: '#',
    },
];

interface Diagnosis {
    hasDisease: boolean;
    diseaseName: string | null;
    severity: 'mild' | 'moderate' | 'severe' | null;
    confidence: number;
    symptoms: string[];
    affectedAreas: string[];
    recommendations: string[];
    notes: string | null;
    detectedRegions: string | null;
}

interface ResultProps {
    diagnosis: Diagnosis;
    imageUrl: string;
    plantName: string | null;
}

export default function PlantDiseaseResult({
    diagnosis,
    imageUrl,
    plantName,
}: ResultProps) {
    // Normalize image URL - ensure it's a valid path
    const normalizedImageUrl = imageUrl?.startsWith('/') ? imageUrl : imageUrl ? `/${imageUrl}` : null;
    const getSeverityColor = (severity: string | null) => {
        switch (severity) {
            case 'mild':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'moderate':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'severe':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) {
            return 'text-green-600 dark:text-green-400';
        } else if (confidence >= 0.6) {
            return 'text-yellow-600 dark:text-yellow-400';
        } else {
            return 'text-orange-600 dark:text-orange-400';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Disease Detection Results" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="mx-auto w-full max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                                        diagnosis.hasDisease 
                                            ? 'bg-red-100 dark:bg-red-900/30' 
                                            : 'bg-green-100 dark:bg-green-900/30'
                                    }`}>
                                        {diagnosis.hasDisease ? (
                                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                        ) : (
                                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        )}
                                    </div>
                                    <h1 className="text-4xl font-bold text-primary">
                                        Disease Detection Results
                                    </h1>
                                </div>
                                <p className="text-lg text-muted-foreground ml-15">
                                    {diagnosis.hasDisease 
                                        ? 'Health issues detected in your plant'
                                        : 'Your plant appears to be healthy'}
                                </p>
                            </div>
                            <Link href="/plant-disease">
                                <Button
                                    variant="outline"
                                    className="shadow-md hover:shadow-lg transition-shadow border-primary text-primary"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Analyze Another
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Image Section */}
                        <Card className="border-2 shadow-lg border-primary/20">
                            <CardHeader className="pb-4 bg-primary/10">
                                <CardTitle
                                    className="flex items-center gap-3 text-xl text-primary"
                                >
                                    <div className="p-2 rounded-lg bg-primary/20">
                                        <Leaf className="h-5 w-5" />
                                    </div>
                                    Uploaded Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="relative rounded-xl overflow-hidden bg-muted">
                                    {normalizedImageUrl ? (
                                        <img
                                            src={normalizedImageUrl}
                                            alt="Analyzed plant"
                                            className="w-full max-h-96 object-contain rounded-xl border-2 shadow-inner border-border"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                console.error('Failed to load image:', normalizedImageUrl);
                                                target.style.display = 'none';
                                                const errorDiv = document.createElement('div');
                                                errorDiv.className = 'w-full h-64 flex flex-col items-center justify-center bg-muted rounded-xl border-2 border-border';
                                                errorDiv.innerHTML = '<p class="text-muted-foreground mb-2">Image not available</p><p class="text-xs text-muted-foreground">Path: ' + normalizedImageUrl + '</p>';
                                                target.parentElement?.appendChild(errorDiv);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-64 flex items-center justify-center bg-muted rounded-xl border-2 border-border">
                                            <p className="text-muted-foreground">Image not available</p>
                                        </div>
                                    )}
                                </div>
                                {plantName && (
                                    <div className="mt-4 p-3 rounded-lg bg-primary/10">
                                        <p className="text-sm font-medium text-foreground">
                                            <span className="font-semibold text-primary">Plant:</span> {plantName}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Diagnosis Section */}
                        <div className="space-y-6">
                            {/* Status Card */}
                            <Card className={`border-2 shadow-lg ${diagnosis.hasDisease ? 'border-destructive/20 bg-destructive/5' : 'border-primary/20 bg-primary/5'}`}>
                                <CardHeader className={`pb-4 ${diagnosis.hasDisease ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                                    <CardTitle
                                        className="flex items-center gap-3 text-xl text-primary"
                                    >
                                        <div className={`p-2 rounded-lg ${
                                            diagnosis.hasDisease 
                                                ? 'bg-red-100 dark:bg-red-900/30' 
                                                : 'bg-green-100 dark:bg-green-900/30'
                                        }`}>
                                            {diagnosis.hasDisease ? (
                                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            ) : (
                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            )}
                                        </div>
                                        Diagnosis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">Status:</span>
                                        {diagnosis.hasDisease ? (
                                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                <XCircle className="mr-1 h-3 w-3" />
                                                Disease Detected
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                Healthy
                                            </Badge>
                                        )}
                                    </div>

                                    {diagnosis.hasDisease && diagnosis.diseaseName && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">Disease:</span>
                                            <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                                {diagnosis.diseaseName}
                                            </span>
                                        </div>
                                    )}

                                    {diagnosis.severity && (
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">Severity:</span>
                                            <Badge className={getSeverityColor(diagnosis.severity)}>
                                                {diagnosis.severity.charAt(0).toUpperCase() +
                                                    diagnosis.severity.slice(1)}
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">Confidence:</span>
                                        <span
                                            className={`font-semibold ${getConfidenceColor(
                                                diagnosis.confidence,
                                            )}`}
                                        >
                                            {Math.round(diagnosis.confidence * 100)}%
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Symptoms */}
                            {diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
                                <Card className="border-2 shadow-md border-primary/20">
                                    <CardHeader className="pb-4 bg-primary/10">
                                        <CardTitle
                                            className="flex items-center gap-3 text-lg text-primary"
                                        >
                                            <div className="p-2 rounded-lg bg-primary/20">
                                                <Info className="h-5 w-5" />
                                            </div>
                                            Symptoms
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <ul className="space-y-3">
                                            {diagnosis.symptoms.map((symptom, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 bg-primary/20 text-primary">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-sm text-foreground">{symptom}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Affected Areas */}
                            {diagnosis.affectedAreas &&
                                diagnosis.affectedAreas.length > 0 && (
                                    <Card className="border-2 shadow-md border-primary/20">
                                        <CardHeader className="pb-4 bg-primary/10">
                                            <CardTitle
                                                className="flex items-center gap-3 text-lg text-primary"
                                            >
                                                <div className="p-2 rounded-lg bg-primary/20">
                                                    <MapPin className="h-5 w-5" />
                                                </div>
                                                Affected Areas
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <div className="flex flex-wrap gap-2">
                                                {diagnosis.affectedAreas.map((area, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="px-3 py-1.5 text-sm font-medium shadow-sm border-primary text-primary bg-primary/10"
                                                    >
                                                        {area}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Recommendations */}
                            {diagnosis.recommendations &&
                                diagnosis.recommendations.length > 0 && (
                                    <Card className="border-2 shadow-md border-primary/20 bg-amber-50 dark:bg-amber-950/20">
                                        <CardHeader className="pb-4 bg-amber-100/50 dark:bg-amber-900/20">
                                            <CardTitle
                                                className="flex items-center gap-3 text-lg text-primary"
                                            >
                                                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                                </div>
                                                Treatment Recommendations
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <ul className="space-y-3">
                                                {diagnosis.recommendations.map(
                                                    (recommendation, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start gap-3 p-3 rounded-lg bg-card/60 hover:bg-card transition-colors"
                                                        >
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                                                                {index + 1}
                                                            </span>
                                                            <span className="text-sm text-foreground flex-1">{recommendation}</span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Notes */}
                            {diagnosis.notes && (
                                <Card className="border-2 shadow-md border-primary/20">
                                    <CardHeader className="pb-4 bg-primary/10">
                                        <CardTitle
                                            className="flex items-center gap-3 text-lg text-primary"
                                        >
                                            <div className="p-2 rounded-lg bg-primary/20">
                                                <Info className="h-5 w-5" />
                                            </div>
                                            Additional Notes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="p-4 rounded-lg bg-muted">
                                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                                {diagnosis.notes}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Detected Regions */}
                            {diagnosis.detectedRegions && (
                                <Card
                                    className="border-2 border-primary/20"
                                >
                                    <CardHeader className="bg-primary/10">
                                        <CardTitle
                                            className="flex items-center gap-2 text-primary"
                                        >
                                            <MapPin className="h-5 w-5" />
                                            Detected Regions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-muted-foreground">
                                            {diagnosis.detectedRegions}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

