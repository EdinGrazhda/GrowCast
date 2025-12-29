import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Loader2, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Plant Disease Detection',
        href: '/plant-disease',
    },
];

export default function PlantDiseaseIndex() {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        image: null as File | null,
        plant_name: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                return;
            }

            setData('image', file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.image) {
            return;
        }

        post('/plant-disease/detect', {
            forceFormData: true,
        });
    };

    const handleRemoveImage = () => {
        setData('image', null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Plant Disease Detection" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="mx-auto w-full max-w-5xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#74C69D20' }}>
                            <ImageIcon className="h-8 w-8" style={{ color: '#2D6A4F' }} />
                        </div>
                        <h1 className="text-4xl font-bold mb-3" style={{ color: '#2D6A4F' }}>
                            Plant Disease Detection
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Upload an image of your plant to get an AI-powered diagnosis of diseases, pests, and health issues
                        </p>
                    </div>

                    {/* Form */}
                    <Card className="border-2 shadow-lg" style={{ borderColor: '#74C69D40' }}>
                        <CardHeader className="pb-4" style={{ backgroundColor: '#74C69D10' }}>
                            <CardTitle
                                className="flex items-center gap-3 text-xl"
                                style={{ color: '#2D6A4F' }}
                            >
                                <div className="p-2 rounded-lg" style={{ backgroundColor: '#74C69D30' }}>
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                                Upload Plant Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="image"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Plant Image *
                                    </Label>
                                    <div className="space-y-4">
                                        {preview ? (
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                                <img
                                                    src={preview}
                                                    alt="Plant preview"
                                                    className="w-full max-h-96 object-contain rounded-xl border-2 shadow-md border-gray-200 dark:border-gray-700"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-3 right-3 z-20 shadow-lg backdrop-blur-sm"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        borderColor: '#ef4444',
                                                        color: '#ef4444',
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all hover:border-[#2D6A4F] hover:bg-[#74C69D05] hover:shadow-md"
                                                style={{
                                                    borderColor: '#74C69D',
                                                    backgroundColor: '#74C69D02',
                                                }}
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: '#74C69D15' }}>
                                                    <Upload className="h-10 w-10" style={{ color: '#2D6A4F' }} />
                                                </div>
                                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    PNG, JPG, GIF, WEBP up to 10MB
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                    {errors.image && (
                                        <div className="flex items-center gap-2 text-sm text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.image}
                                        </div>
                                    )}
                                </div>

                                {/* Plant Name (Optional) */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="plant_name"
                                        style={{ color: '#2D6A4F' }}
                                    >
                                        Plant Name (Optional)
                                    </Label>
                                    <Input
                                        id="plant_name"
                                        type="text"
                                        value={data.plant_name}
                                        onChange={(e) =>
                                            setData('plant_name', e.target.value)
                                        }
                                        className="focus:border-[#2D6A4F] focus:ring-[#2D6A4F]"
                                        placeholder="e.g., Tomato, Rose, Apple Tree"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Providing the plant name can improve detection accuracy
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.image}
                                        style={{
                                            backgroundColor: '#2D6A4F',
                                            color: 'white',
                                        }}
                                        className="min-w-[160px] h-11 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="mr-2 h-5 w-5" />
                                                Analyze Image
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-6 border-2 shadow-md" style={{ borderColor: '#74C69D40', backgroundColor: '#F0FDF4' }}>
                        <CardHeader className="pb-3" style={{ backgroundColor: '#74C69D15' }}>
                            <CardTitle
                                className="flex items-center gap-3 text-lg font-semibold"
                                style={{ color: '#2D6A4F' }}
                            >
                                <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#74C69D30' }}>
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                                How It Works
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF80' }}>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#74C69D30', color: '#2D6A4F' }}>
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Upload Image</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Upload a clear image of the plant part (leaf, stem, or whole plant)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF80' }}>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#74C69D30', color: '#2D6A4F' }}>
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">AI Analysis</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Our AI analyzes the image for diseases, pests, and health issues
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF80' }}>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#74C69D30', color: '#2D6A4F' }}>
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Get Diagnosis</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Receive detailed diagnosis with severity and treatment recommendations
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF80' }}>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#74C69D30', color: '#2D6A4F' }}>
                                        4
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Best Results</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Use well-lit images with clear focus on the affected area
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

