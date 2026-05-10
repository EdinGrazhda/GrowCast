import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface DemoDiseaseProps {
    remainingScans: number;
    maxScans: number;
}

export default function DemoDiseaseDetection({
    remainingScans,
    maxScans,
}: DemoDiseaseProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [plantName, setPlantName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (!selected.type.startsWith('image/')) {
                setError('Please upload a valid image file.');
                return;
            }
            if (selected.size > 5 * 1024 * 1024) {
                setError('Demo mode: Image size must not exceed 5MB.');
                return;
            }
            setFile(selected);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selected);
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || remainingScans <= 0) return;

        setProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);
        if (plantName) formData.append('plant_name', plantName);

        router.post('/demo/plant-disease/detect', formData, {
            forceFormData: true,
            onError: (errors) => {
                setProcessing(false);
                setError(
                    errors.image ||
                        errors.limit ||
                        'An error occurred. Please try again.',
                );
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Demo - Plant Disease Detection">
                <meta
                    name="description"
                    content="Try our AI-powered plant disease detector for free - no account needed"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#D8F3DC]">
                <Navbar />

                <main className="flex-1">
                    {/* Hero heading section */}
                    <section className="relative w-full overflow-hidden bg-white py-20">
                        {/* Background glow */}
                        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8f3dc] opacity-50 blur-[140px]" />

                        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                            {/* Demo badge */}
                            <div className="fade-in-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#b7e4c7] bg-[#d8f3dc]/60 px-5 py-2 text-sm font-medium text-[#2d6a4f]">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#52b788]" />
                                Demo Version
                            </div>

                            <h1 className="fade-in-up mb-4 text-4xl font-bold text-[#1b4332] md:text-5xl">
                                Plant Disease Detector
                            </h1>
                            <p className="fade-in-up mx-auto mb-6 max-w-2xl text-lg text-[#2d6a4f] delay-200">
                                Upload a photo of your plant and our AI will
                                analyze it for diseases, pests, and health
                                issues.
                            </p>

                            <div className="fade-in-up flex justify-center delay-200">
                                <div className="h-[4px] w-32 animate-pulse rounded-full bg-gradient-to-r from-[#52b788] to-[#40916c]" />
                            </div>
                        </div>
                    </section>

                    {/* Upload section */}
                    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#E8F7EE] to-white py-20">
                        {/* Dot pattern */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-20"
                            style={{
                                backgroundImage:
                                    'radial-gradient(#b7e4c7 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }}
                        />

                        <div className="relative z-10 mx-auto max-w-3xl px-6">
                            {/* Remaining scans indicator */}
                            <div className="fade-in-up mx-auto mb-8 max-w-md">
                                <div className="flex items-center justify-between rounded-xl border border-[#b7e4c7] bg-white/80 px-5 py-3 shadow-sm backdrop-blur-md">
                                    <span className="text-sm font-medium text-[#2d6a4f]">
                                        Remaining scans
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: maxScans }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-3 w-3 rounded-full transition-colors ${
                                                        i < remainingScans
                                                            ? 'bg-[#52b788]'
                                                            : 'bg-gray-300'
                                                    }`}
                                                />
                                            ),
                                        )}
                                        <span className="ml-2 text-sm font-semibold text-[#1b4332]">
                                            {remainingScans}/{maxScans}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {remainingScans <= 0 ? (
                                /* Limit reached */
                                <div className="fade-in-up rounded-3xl border border-[#d8f3dc] bg-white p-10 text-center shadow-xl">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-orange-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-2xl font-bold text-[#1b4332]">
                                        Demo Limit Reached
                                    </h3>
                                    <p className="mb-6 text-[#2d6a4f]/80">
                                        You've used all {maxScans} free scans.
                                        Create an account to get unlimited
                                        access to our plant disease detector.
                                    </p>
                                    <a
                                        href="/register"
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#52b788] to-[#40916c] px-8 py-3 font-semibold text-white shadow-md transition-all hover:scale-[1.05] hover:shadow-lg"
                                    >
                                        Create Free Account
                                    </a>
                                </div>
                            ) : (
                                /* Upload form */
                                <form
                                    onSubmit={handleSubmit}
                                    className="fade-in-up space-y-6"
                                >
                                    {/* Image upload area */}
                                    <div className="rounded-3xl border border-[#d8f3dc] bg-white p-8 shadow-xl">
                                        {preview ? (
                                            <div className="relative">
                                                <img
                                                    src={preview}
                                                    alt="Plant preview"
                                                    className="mx-auto max-h-80 rounded-2xl border-2 border-[#d8f3dc] object-contain shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-3 right-3 rounded-lg border border-red-300 bg-white/95 px-3 py-1.5 text-sm font-medium text-red-600 shadow-md backdrop-blur-sm transition hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="cursor-pointer rounded-2xl border-2 border-dashed border-[#b7e4c7] bg-[#f6fff8] p-14 text-center transition-all hover:border-[#52b788] hover:bg-[#e8f7ee] hover:shadow-md"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#52b788]/15">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-10 w-10 text-[#52b788]"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={1.5}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="mb-2 text-lg font-medium text-[#1b4332]">
                                                    Click to upload or drag and
                                                    drop
                                                </p>
                                                <p className="text-sm text-[#2d6a4f]/60">
                                                    PNG, JPG, GIF, WEBP up to
                                                    5MB
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Plant name input */}
                                    <div className="rounded-3xl border border-[#d8f3dc] bg-white p-6 shadow-lg">
                                        <label className="mb-2 block text-sm font-semibold text-[#2d6a4f]">
                                            Plant Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={plantName}
                                            onChange={(e) =>
                                                setPlantName(e.target.value)
                                            }
                                            placeholder="e.g., Tomato, Rose, Apple Tree"
                                            className="w-full rounded-xl border border-[#b7e4c7]/60 bg-white/70 px-5 py-3 text-[#1b4332] shadow-sm backdrop-blur-md placeholder:text-[#1b4332]/40 focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/30 focus:outline-none"
                                        />
                                        <p className="mt-2 text-xs text-[#2d6a4f]/60">
                                            Providing the plant name can improve
                                            detection accuracy
                                        </p>
                                    </div>

                                    {/* Error message */}
                                    {error && (
                                        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 flex-shrink-0"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                                />
                                            </svg>
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            disabled={processing || !file}
                                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#52b788] to-[#40916c] px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.05] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            <span className="absolute inset-0 bg-white/20 opacity-0 mix-blend-overlay transition-all duration-700 group-hover:opacity-100" />
                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="h-5 w-5 animate-spin"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                        />
                                                    </svg>
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                                        />
                                                    </svg>
                                                    Analyze Plant
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* How it works */}
                            <div className="fade-in-up mt-16 rounded-3xl border border-[#d8f3dc] bg-white p-10 shadow-xl delay-300">
                                <h3 className="mb-8 text-center text-2xl font-bold text-[#1b4332]">
                                    How It Works
                                </h3>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    {[
                                        {
                                            step: '1',
                                            title: 'Upload Image',
                                            desc: 'Take a clear photo of the affected plant part',
                                        },
                                        {
                                            step: '2',
                                            title: 'AI Analysis',
                                            desc: 'Our AI scans for diseases, pests, and health issues',
                                        },
                                        {
                                            step: '3',
                                            title: 'Get Results',
                                            desc: 'Receive diagnosis with treatment recommendations',
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.step}
                                            className="rounded-xl border border-[#d8f3dc] bg-[#f6fff8] p-5 text-center transition hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#52b788] text-lg font-bold text-white shadow">
                                                {item.step}
                                            </div>
                                            <p className="mb-1 font-semibold text-[#1b4332]">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-[#2d6a4f]/70">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Demo limitations note */}
                            <div className="fade-in-up mt-8 rounded-2xl border border-[#b7e4c7] bg-[#d8f3dc]/40 p-6 delay-300">
                                <h4 className="mb-3 text-sm font-semibold text-[#1b4332]">
                                    Demo Limitations
                                </h4>
                                <ul className="space-y-2 text-sm text-[#2d6a4f]/80">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 text-[#52b788]">
                                            •
                                        </span>
                                        Limited to {maxScans} scans per session
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 text-[#52b788]">
                                            •
                                        </span>
                                        Maximum image size: 5MB (full version:
                                        10MB)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1 text-[#52b788]">
                                            •
                                        </span>
                                        Basic diagnosis only — sign up for
                                        detailed treatment plans
                                    </li>
                                </ul>
                                <div className="mt-4">
                                    <a
                                        href="/register"
                                        className="text-sm font-semibold text-[#2d6a4f] underline decoration-[#52b788] underline-offset-4 transition hover:text-[#1b4332]"
                                    >
                                        Create a free account for full access
                                        &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
