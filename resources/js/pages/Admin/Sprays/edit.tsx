import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2, Sprout } from 'lucide-react';

interface Farm {
    id: number;
    name: string;
    plant: {
        id: number;
        name: string;
    };
}

interface Plant {
    id: number;
    name: string;
}

interface Spray {
    id: number;
    farm_id: number;
    plant_id: number;
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
}

interface Props {
    spray: Spray;
    farms: Farm[];
    plants: Plant[];
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
        title: 'Edit',
        href: '#',
    },
];

export default function Edit({ spray, farms, plants }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        farm_id: spray.farm_id.toString() || '',
        plant_id: spray.plant_id.toString() || '',
        spray_name: spray.spray_name || '',
        chemical_name: spray.chemical_name || '',
        purpose: spray.purpose || '',
        plant_pest: spray.plant_pest || '',
        dosage: spray.dosage || '',
        application_rate: spray.application_rate || '',
        frequency: spray.frequency || '',
        application_date: spray.application_date || '',
        season: spray.season || '',
        month: spray.month || '',
        notes: spray.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/sprays/${spray.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Spray - ${spray.spray_name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1
                                    className="text-3xl font-bold"
                                    style={{ color: '#2D6A4F' }}
                                >
                                    Edit Spray Record
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Update spray application information
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <Card
                        className="border-2"
                        style={{ borderColor: '#74C69D40' }}
                    >
                        <CardHeader style={{ backgroundColor: '#74C69D10' }}>
                            <CardTitle
                                className="flex items-center gap-2"
                                style={{ color: '#2D6A4F' }}
                            >
                                <Sprout className="h-5 w-5" />
                                Spray Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Farm Selection */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="farm_id"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Farm *
                                    </Label>
                                    <Select
                                        value={data.farm_id}
                                        onValueChange={(value) =>
                                            setData('farm_id', value)
                                        }
                                    >
                                        <SelectTrigger className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]">
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
                                    {errors.farm_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.farm_id}
                                        </p>
                                    )}
                                </div>

                                {/* Plant Selection */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="plant_id"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Plant *
                                    </Label>
                                    <Select
                                        value={data.plant_id}
                                        onValueChange={(value) =>
                                            setData('plant_id', value)
                                        }
                                    >
                                        <SelectTrigger className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]">
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
                                    {errors.plant_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.plant_id}
                                        </p>
                                    )}
                                </div>

                                {/* Spray Name */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="spray_name"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Spray Name *
                                    </Label>
                                    <Input
                                        id="spray_name"
                                        type="text"
                                        value={data.spray_name}
                                        onChange={(e) =>
                                            setData(
                                                'spray_name',
                                                e.target.value,
                                            )
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="Enter spray name"
                                    />
                                    {errors.spray_name && (
                                        <p className="text-sm text-red-500">
                                            {errors.spray_name}
                                        </p>
                                    )}
                                </div>

                                {/* Chemical Name */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="chemical_name"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Chemical Name *
                                    </Label>
                                    <Input
                                        id="chemical_name"
                                        type="text"
                                        value={data.chemical_name}
                                        onChange={(e) =>
                                            setData(
                                                'chemical_name',
                                                e.target.value,
                                            )
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="Enter chemical name"
                                    />
                                    {errors.chemical_name && (
                                        <p className="text-sm text-red-500">
                                            {errors.chemical_name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Purpose */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="purpose"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Purpose *
                                        </Label>
                                        <Input
                                            id="purpose"
                                            type="text"
                                            value={data.purpose}
                                            onChange={(e) =>
                                                setData(
                                                    'purpose',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="e.g., Pest Control, Disease Prevention"
                                        />
                                        {errors.purpose && (
                                            <p className="text-sm text-red-500">
                                                {errors.purpose}
                                            </p>
                                        )}
                                    </div>

                                    {/* Plant Pest */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="plant_pest"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Target Pest
                                        </Label>
                                        <Input
                                            id="plant_pest"
                                            type="text"
                                            value={data.plant_pest}
                                            onChange={(e) =>
                                                setData(
                                                    'plant_pest',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="Enter target pest"
                                        />
                                        {errors.plant_pest && (
                                            <p className="text-sm text-red-500">
                                                {errors.plant_pest}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-3">
                                    {/* Dosage */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="dosage"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Dosage *
                                        </Label>
                                        <Input
                                            id="dosage"
                                            type="text"
                                            value={data.dosage}
                                            onChange={(e) =>
                                                setData(
                                                    'dosage',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="e.g., 2ml/L"
                                        />
                                        {errors.dosage && (
                                            <p className="text-sm text-red-500">
                                                {errors.dosage}
                                            </p>
                                        )}
                                    </div>

                                    {/* Application Rate */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="application_rate"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Application Rate
                                        </Label>
                                        <Input
                                            id="application_rate"
                                            type="text"
                                            value={data.application_rate}
                                            onChange={(e) =>
                                                setData(
                                                    'application_rate',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="e.g., 100L/hectare"
                                        />
                                        {errors.application_rate && (
                                            <p className="text-sm text-red-500">
                                                {errors.application_rate}
                                            </p>
                                        )}
                                    </div>

                                    {/* Frequency */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="frequency"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Frequency
                                        </Label>
                                        <Input
                                            id="frequency"
                                            type="text"
                                            value={data.frequency}
                                            onChange={(e) =>
                                                setData(
                                                    'frequency',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="e.g., Weekly, Bi-weekly"
                                        />
                                        {errors.frequency && (
                                            <p className="text-sm text-red-500">
                                                {errors.frequency}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-3">
                                    {/* Application Date */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="application_date"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Application Date *
                                        </Label>
                                        <Input
                                            id="application_date"
                                            type="date"
                                            value={data.application_date}
                                            onChange={(e) =>
                                                setData(
                                                    'application_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        />
                                        {errors.application_date && (
                                            <p className="text-sm text-red-500">
                                                {errors.application_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* Season */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="season"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Season
                                        </Label>
                                        <Input
                                            id="season"
                                            type="text"
                                            value={data.season}
                                            onChange={(e) =>
                                                setData(
                                                    'season',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="e.g., Spring, Summer"
                                        />
                                        {errors.season && (
                                            <p className="text-sm text-red-500">
                                                {errors.season}
                                            </p>
                                        )}
                                    </div>

                                    {/* Month */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="month"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Month
                                        </Label>
                                        <Input
                                            id="month"
                                            type="text"
                                            value={data.month}
                                            onChange={(e) =>
                                                setData('month', e.target.value)
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="e.g., January"
                                        />
                                        {errors.month && (
                                            <p className="text-sm text-red-500">
                                                {errors.month}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="notes"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="Enter additional notes or observations"
                                        rows={4}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-500">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4 pt-4">
                                    <Link href="/sprays">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            style={{
                                                borderColor: '#74C69D',
                                                color: '#2D6A4F',
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            backgroundColor: '#2D6A4F',
                                            color: 'white',
                                        }}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Spray Record'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
