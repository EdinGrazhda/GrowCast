<?php

namespace App\Http\Controllers;

use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DemoPlantDiseaseController extends Controller
{
    protected $openAIService;

    /**
     * Maximum scans allowed per session in demo mode
     */
    protected int $maxScans = 3;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    /**
     * Show the demo disease detection page
     */
    public function index(Request $request)
    {
        $usedScans = $request->session()->get('demo_disease_scans', 0);

        return Inertia::render('Demo/DiseaseDetection', [
            'remainingScans' => max(0, $this->maxScans - $usedScans),
            'maxScans' => $this->maxScans,
        ]);
    }

    /**
     * Handle demo disease detection (limited version)
     */
    public function detect(Request $request)
    {
        // Check demo scan limit
        $usedScans = $request->session()->get('demo_disease_scans', 0);

        if ($usedScans >= $this->maxScans) {
            return back()->withErrors([
                'limit' => 'Demo limit reached. Please create an account for unlimited access.',
            ]);
        }

        // Validate with demo restrictions (smaller file size)
        $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,gif,webp',
                'max:5120', // 5MB max for demo (vs 10MB for full)
            ],
            'plant_name' => 'nullable|string|max:255',
        ], [
            'image.required' => 'Please upload an image of the plant.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a file of type: jpeg, jpg, png, gif, or webp.',
            'image.max' => 'Demo mode: Image size must not exceed 5MB.',
        ]);

        $imagePath = null;

        try {
            $image = $request->file('image');
            $plantName = $request->input('plant_name');

            // Store the image temporarily
            $imagePath = $image->store('temp/demo-plant-disease', 'public');

            if (! $imagePath) {
                return back()->withErrors([
                    'image' => 'Failed to store the uploaded image.',
                ]);
            }

            $fullPath = storage_path('app/public/'.$imagePath);

            if (! file_exists($fullPath)) {
                Log::error('Demo Plant Disease: Image storage failed', ['path' => $fullPath]);

                return back()->withErrors([
                    'image' => 'Failed to store the image. Please try again.',
                ]);
            }

            // Analyze the image using OpenAI
            $diagnosis = $this->openAIService->analyzePlantDisease($fullPath, $plantName);

            if ($diagnosis === null) {
                if ($imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }

                return back()->withErrors([
                    'image' => 'Failed to analyze the image. Please try again.',
                ]);
            }

            // Increment demo scan counter
            $request->session()->put('demo_disease_scans', $usedScans + 1);

            // For demo: strip detectedRegions (keep it simpler)
            unset($diagnosis['detectedRegions']);

            $imageUrl = '/storage/'.$imagePath;

            if (! Storage::disk('public')->exists($imagePath)) {
                $imageUrl = null;
            }

            $remainingScans = max(0, $this->maxScans - ($usedScans + 1));

            return Inertia::render('Demo/DiseaseResult', [
                'diagnosis' => $diagnosis,
                'imageUrl' => $imageUrl,
                'plantName' => $plantName,
                'remainingScans' => $remainingScans,
                'maxScans' => $this->maxScans,
            ]);
        } catch (\Exception $e) {
            if ($imagePath) {
                try {
                    Storage::disk('public')->delete($imagePath);
                } catch (\Exception $deleteException) {
                    Log::warning('Demo: Failed to delete image on error', [
                        'path' => $imagePath,
                        'error' => $deleteException->getMessage(),
                    ]);
                }
            }

            Log::error('Demo Plant Disease Detection Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'image' => 'An error occurred while analyzing the image. Please try again.',
            ]);
        }
    }
}
