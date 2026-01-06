import { useState } from "react";
import { Head, Link } from "@inertiajs/react";

export default function PlantDiagnosis() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!image) return;

    setLoading(true);
    setResult(null);

    // MOCK AI RESPONSE
    setTimeout(() => {
      setResult("Possible leaf disease detected based on visual stress patterns.");
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <Head title="Plant Diagnosis | GrowCast" />

      <section className="min-h-screen bg-gradient-to-b from-[#E8F7EE] to-white py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">

          {/* HEADER */}
          <h1 className="text-5xl font-bold text-[#1b4332] mb-4 fade-in-up">
            AI Plant Disease Diagnosis
          </h1>

          <p className="text-[#2d6a4f] text-lg max-w-2xl mx-auto mb-14 fade-in-up delay-100">
            Upload a clear photo of your plant and let GrowCast AI identify
            the <span className="font-semibold">possible problem</span>.
            <br />
            <span className="font-semibold">
              Diagnosis only — no treatment recommendations.
            </span>
          </p>

          {/* CARD */}
          <div className="bg-white border border-[#d8f3dc] rounded-3xl p-10 shadow-2xl fade-in-up delay-200">

            {/* UPLOAD BOX */}
            <label
              htmlFor="plant-image"
              className="flex flex-col items-center justify-center
                         border-2 border-dashed border-[#b7e4c7]
                         rounded-2xl p-10 cursor-pointer
                         hover:bg-[#f6fff8] transition"
            >
              <span className="text-5xl mb-4">📷</span>
              <p className="text-[#1b4332] font-semibold">
                Click to upload plant photo
              </p>
              <p className="text-sm text-[#2d6a4f]/70 mt-1">
                JPG, PNG — clear leaf image recommended
              </p>

              <input
                id="plant-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* PREVIEW */}
            {preview && (
              <div className="mt-10">
                <p className="text-sm font-semibold text-[#40916c] mb-2">
                  Image Preview
                </p>
                <img
                  src={preview}
                  alt="Plant preview"
                  className="mx-auto max-h-80 rounded-2xl shadow-lg border"
                />
              </div>
            )}

            {/* ANALYZE BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="mt-12 inline-flex items-center gap-3
                         px-12 py-4 rounded-full
                         bg-gradient-to-r from-[#52b788] to-[#40916c]
                         text-white text-lg font-semibold shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:scale-105 transition-all"
            >
              {loading ? (
                <>
                  <span className="animate-spin">🧠</span>
                  Analyzing…
                </>
              ) : (
                <>
                  <span>🌱</span>
                  Analyze Plant
                </>
              )}
            </button>

            {/* RESULT */}
            {result && (
              <div className="mt-12 bg-[#f6fff8] border border-[#ccefd8]
                              rounded-2xl p-8 text-left animate-pop">
                <p className="text-sm font-semibold text-[#40916c] mb-2">
                  Detected Problem
                </p>
                <p className="text-xl font-semibold text-[#1b4332]">
                  {result}
                </p>
              </div>
            )}
          </div>

          {/* BACK */}
          <Link
            href="/"
            className="inline-block mt-10 text-[#40916c] font-semibold hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
