import MapPicker from '@/components/map-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2, MapPin } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Plant {
    id: number;
    name: string;
    stock: number;
}

interface Props {
    users: User[];
    plants: Plant[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Farms',
        href: '/farms',
    },
    {
        title: 'Create',
        href: '/farms/create',
    },
];

export default function Create({ users, plants }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        longitute: '',
        latitude: '',
        user_id: '',
        plant_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/farms');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Farm" />

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
                                    Create New Farm
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Add a new farm to the system
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
                                <MapPin className="h-5 w-5" />
                                Farm Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Farm Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="Enter farm name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="Enter farm description"
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* User and Plant in a row */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* User */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="user_id"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Owner *
                                        </Label>
                                        <select
                                            id="user_id"
                                            value={data.user_id}
                                            onChange={(e) =>
                                                setData(
                                                    'user_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-[#2D6A4F] focus:ring-[#2D6A4F] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                        >
                                            <option value="">
                                                Select owner
                                            </option>
                                            {users.map((user) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.user_id && (
                                            <p className="text-sm text-red-500">
                                                {errors.user_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Plant */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="plant_id"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Plant *
                                        </Label>
                                        <select
                                            id="plant_id"
                                            value={data.plant_id}
                                            onChange={(e) =>
                                                setData(
                                                    'plant_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-[#2D6A4F] focus:ring-[#2D6A4F] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                        >
                                            <option value="">
                                                Select plant
                                            </option>
                                            {plants.map((plant) => (
                                                <option
                                                    key={plant.id}
                                                    value={plant.id}
                                                >
                                                    {plant.name} (Stock:{' '}
                                                    {plant.stock})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.plant_id && (
                                            <p className="text-sm text-red-500">
                                                {errors.plant_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Map Picker */}
                                <div className="space-y-2">
                                    <Label style={{ color: '#2D6A4F' }}>
                                        Farm Location *
                                    </Label>
                                    <MapPicker
                                        latitude={
                                            parseFloat(data.latitude) || 0
                                        }
                                        longitude={
                                            parseFloat(data.longitute) || 0
                                        }
                                        onLocationSelect={(lat, lng) => {
                                            setData({
                                                ...data,
                                                latitude: lat.toFixed(6),
                                                longitute: lng.toFixed(6),
                                            });
                                        }}
                                    />
                                </div>

                                {/* Location in a row */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Latitude */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="latitude"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Latitude *
                                        </Label>
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            value={data.latitude}
                                            onChange={(e) =>
                                                setData(
                                                    'latitude',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="e.g., 42.1234"
                                        />
                                        {errors.latitude && (
                                            <p className="text-sm text-red-500">
                                                {errors.latitude}
                                            </p>
                                        )}
                                    </div>

                                    {/* Longitude */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="longitute"
                                            style={{ color: '#2D6A4F' }}
                                        >
                                            Longitude *
                                        </Label>
                                        <Input
                                            id="longitute"
                                            type="number"
                                            step="any"
                                            value={data.longitute}
                                            onChange={(e) =>
                                                setData(
                                                    'longitute',
                                                    e.target.value,
                                                )
                                            }
                                            className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                            placeholder="e.g., 19.5678"
                                        />
                                        {errors.longitute && (
                                            <p className="text-sm text-red-500">
                                                {errors.longitute}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4 pt-4">
                                    <Link href="/farms">
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
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Farm'
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
