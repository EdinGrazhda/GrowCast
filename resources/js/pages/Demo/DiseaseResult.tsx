import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Head, Link } from '@inertiajs/react';

interface Diagnosis {
    hasDisease: boolean;
    diseaseName: string | null;
    severity: 'mild' | 'moderate' | 'severe' | null;
    confidence: number;
    symptoms: string[];
    affectedAreas: string[];
    recommendations: string[];
    notes: string | null;
}

interface DemoResultProps {
    diagnosis: Diagnosis;
    imageUrl: string;
    plantName: string | null;
    remainingScans: number;
    maxScans: number;
}

export default function DemoDiseaseResult({
    diagnosis,
    imageUrl,
    plantName,
    remainingScans,
    maxScans,
}: DemoResultProps) {
    const normalizedImageUrl = imageUrl?.startsWith('/')
        ? imageUrl
        : imageUrl
          ? `/${imageUrl}`
          : null;

    const getSeverityColor = (severity: string | null) => {
        switch (severity) {
            case 'mild':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'moderate':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'severe':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-300';
        }
    };

    return (
        <>
            <Head title="Demo - Disease Detection Results" />

            <div className="flex min-h-screen flex-col bg-[#D8F3DC]">
                <Navbar />

                <main className="flex-1">
                    {/* Header section */}
                    <section className="relative w-full overflow-hidden bg-white py-16">
                        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8f3dc] opacity-50 blur-[140px]" />

                        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#b7e4c7] bg-[#d8f3dc]/60 px-5 py-2 text-sm font-medium text-[#2d6a4f]">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#52b788]" />
                                Demo Results
                            </div>

                            <div className="mb-4 flex items-center justify-center gap-3">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                        diagnosis.hasDisease
                                            ? 'bg-red-100'
                                            : 'bg-green-100'
                                    }`}
                                >
                                    {diagnosis.hasDisease ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-red-600"
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
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-green-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <h1 className="text-4xl font-bold text-[#1b4332]">
                                    Detection Results
                                </h1>
                            </div>

                            <p className="text-lg text-[#2d6a4f]">
                                {diagnosis.hasDisease
                                    ? 'Health issues detected in your plant'
                                    : 'Your plant appears to be healthy'}
                            </p>
                        </div>
                    </section>

                    {/* Results section */}
                    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#E8F7EE] to-white py-16">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-20"
                            style={{
                                backgroundImage:
                                    'radial-gradient(#b7e4c7 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }}
                        />

                        <div className="relative z-10 mx-auto max-w-5xl px-6">
                            <div className="grid gap-8 lg:grid-cols-2">
                                {/* Image card */}
                                <div className="rounded-3xl border border-[#d8f3dc] bg-white p-6 shadow-xl">
                                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b4332]">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#52b788]/15 text-[#52b788]">
                                            🌿
                                        </span>
                                        Uploaded Image
                                    </h3>
                                    {normalizedImageUrl ? (
                                        <img
                                            src={normalizedImageUrl}
                                            alt="Analyzed plant"
                                            className="max-h-80 w-full rounded-2xl border-2 border-[#d8f3dc] object-contain shadow-md"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-[#d8f3dc] bg-[#f6fff8]">
                                            <p className="text-[#2d6a4f]/60">
                                                Image not available
                                            </p>
                                        </div>
                                    )}
                                    {plantName && (
                                        <div className="mt-4 rounded-xl bg-[#f6fff8] p-3">
                                            <p className="text-sm">
                                                <span className="font-semibold text-[#2d6a4f]">
                                                    Plant:
                                                </span>{' '}
                                                <span className="text-[#1b4332]">
                                                    {plantName}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Diagnosis card */}
                                <div className="space-y-6">
                                    {/* Status */}
                                    <div
                                        className={`rounded-3xl border p-6 shadow-xl ${
                                            diagnosis.hasDisease
                                                ? 'border-red-200 bg-white'
                                                : 'border-green-200 bg-white'
                                        }`}
                                    >
                                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b4332]">
                                            <span
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                                    diagnosis.hasDisease
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-green-100 text-green-600'
                                                }`}
                                            >
                                                {diagnosis.hasDisease
                                                    ? '⚠'
                                                    : '✓'}
                                            </span>
                                            Diagnosis
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-[#2d6a4f]">
                                                    Status
                                                </span>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        diagnosis.hasDisease
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-green-100 text-green-700'
                                                    }`}
                                                >
                                                    {diagnosis.hasDisease
                                                        ? 'Disease Detected'
                                                        : 'Healthy'}
                                                </span>
                                            </div>

                                            {diagnosis.hasDisease &&
                                                diagnosis.diseaseName && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-[#2d6a4f]">
                                                            Disease
                                                        </span>
                                                        <span className="text-base font-bold text-red-600">
                                                            {
                                                                diagnosis.diseaseName
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                            {diagnosis.severity && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-[#2d6a4f]">
                                                        Severity
                                                    </span>
                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityColor(diagnosis.severity)}`}
                                                    >
                                                        {diagnosis.severity
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            diagnosis.severity.slice(
                                                                1,
                                                            )}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-[#2d6a4f]">
                                                    Confidence
                                                </span>
                                                <span className="text-base font-semibold text-[#1b4332]">
                                                    {Math.round(
                                                        diagnosis.confidence *
                                                            100,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Symptoms */}
                                    {diagnosis.symptoms &&
                                        diagnosis.symptoms.length > 0 && (
                                            <div className="rounded-3xl border border-[#d8f3dc] bg-white p-6 shadow-lg">
                                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b4332]">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#52b788]/15 text-[#52b788]">
                                                        📋
                                                    </span>
                                                    Symptoms
                                                </h3>
                                                <ul className="space-y-2">
                                                    {diagnosis.symptoms.map(
                                                        (symptom, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-[#f6fff8]"
                                                            >
                                                                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#52b788]/15 text-xs font-semibold text-[#2d6a4f]">
                                                                    {i + 1}
                                                                </span>
                                                                <span className="text-sm text-[#1b4332]">
                                                                    {symptom}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                    {/* Affected Areas */}
                                    {diagnosis.affectedAreas &&
                                        diagnosis.affectedAreas.length > 0 && (
                                            <div className="rounded-3xl border border-[#d8f3dc] bg-white p-6 shadow-lg">
                                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b4332]">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#52b788]/15 text-[#52b788]">
                                                        📍
                                                    </span>
                                                    Affected Areas
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {diagnosis.affectedAreas.map(
                                                        (area, i) => (
                                                            <span
                                                                key={i}
                                                                className="rounded-full border border-[#b7e4c7] bg-[#e8f7ee] px-3 py-1.5 text-sm font-medium text-[#2d6a4f]"
                                                            >
                                                                {area}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Recommendations (limited in demo) */}
                                    {diagnosis.recommendations &&
                                        diagnosis.recommendations.length >
                                            0 && (
                                            <div className="rounded-3xl border border-[#d8f3dc] bg-[#fffdf0] p-6 shadow-lg">
                                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b4332]">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                                                        💡
                                                    </span>
                                                    Recommendations
                                                </h3>
                                                <ul className="space-y-2">
                                                    {diagnosis.recommendations
                                                        .slice(0, 3)
                                                        .map((rec, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-start gap-3 rounded-xl bg-white/60 p-3"
                                                            >
                                                                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-semibold text-yellow-700">
                                                                    {i + 1}
                                                                </span>
                                                                <span className="text-sm text-[#1b4332]">
                                                                    {rec}
                                                                </span>
                                                            </li>
                                                        ))}
                                                </ul>
                                                {diagnosis.recommendations
                                                    .length > 3 && (
                                                    <div className="mt-4 rounded-xl border border-[#b7e4c7] bg-[#d8f3dc]/30 p-3 text-center">
                                                        <p className="text-sm text-[#2d6a4f]/80">
                                                            +
                                                            {diagnosis
                                                                .recommendations
                                                                .length -
                                                                3}{' '}
                                                            more recommendations
                                                            available with a
                                                            free account
                                                        </p>
                                                        <a
                                                            href="/register"
                                                            className="mt-1 inline-block text-sm font-semibold text-[#2d6a4f] underline decoration-[#52b788] underline-offset-4"
                                                        >
                                                            Sign up to see all
                                                            &rarr;
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    {/* Notes */}
                                    {diagnosis.notes && (
                                        <div className="rounded-3xl border border-[#d8f3dc] bg-white p-6 shadow-lg">
                                            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#1b4332]">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#52b788]/15 text-[#52b788]">
                                                    📝
                                                </span>
                                                Notes
                                            </h3>
                                            <p className="rounded-xl bg-[#f6fff8] p-4 text-sm leading-relaxed text-[#1b4332]/80">
                                                {diagnosis.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Link
                                    href="/demo/plant-disease"
                                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#52b788] bg-white px-8 py-3 font-semibold text-[#2d6a4f] shadow-md transition-all hover:scale-[1.05] hover:bg-[#f6fff8] hover:shadow-lg"
                                >
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
                                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                        />
                                    </svg>
                                    {remainingScans > 0
                                        ? 'Analyze Another'
                                        : 'Back to Demo'}
                                </Link>
                                <a
                                    href="/register"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#52b788] to-[#40916c] px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.05] hover:shadow-xl"
                                >
                                    Get Full Access — Sign Up Free
                                </a>
                            </div>

                            {/* Remaining scans */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-[#2d6a4f]/60">
                                    {remainingScans > 0
                                        ? `${remainingScans} demo scan${remainingScans !== 1 ? 's' : ''} remaining`
                                        : 'No demo scans remaining — sign up for unlimited access'}
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
