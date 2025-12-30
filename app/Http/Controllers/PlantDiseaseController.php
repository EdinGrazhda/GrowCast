<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlantDiseaseDetectionRequest;
use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PlantDiseaseController extends Controller
{
    protected $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    /**
     * Show the disease detection page
     */
    public function index()
    {
        return Inertia::render('Admin/PlantDisease/index');
    }

    /**
     * Analyze plant image for disease detection
     */
    public function detect(PlantDiseaseDetectionRequest $request)
    {
        $imagePath = null;
        
        try {
            $image = $request->file('image');
            $plantName = $request->input('plant_name');

            // Store the image temporarily with unique name
            $imagePath = $image->store('temp/plant-disease', 'public');
            
            if (!$imagePath) {
                return back()->withErrors([
                    'image' => 'Failed to store the uploaded image.',
                ]);
            }
            
            $fullPath = storage_path('app/public/'.$imagePath);

            // Verify file was stored successfully
            if (!file_exists($fullPath)) {
                Log::error('Plant Disease Image storage failed', ['path' => $fullPath]);
                return back()->withErrors([
                    'image' => 'Failed to store the image. Please try again.',
                ]);
            }

            // Analyze the image
            $diagnosis = $this->openAIService->analyzePlantDisease($fullPath, $plantName);

            if ($diagnosis === null) {
                // Clean up on error
                if ($imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }
                return back()->withErrors([
                    'image' => 'Failed to analyze the image. Please try again.',
                ]);
            }

            // Generate relative URL for the image
            $imageUrl = '/storage/'.$imagePath;
            
            // Double-check file exists before returning
            if (!Storage::disk('public')->exists($imagePath)) {
                Log::warning('Plant Disease Image not accessible', [
                    'path' => $imagePath,
                    'full_path' => $fullPath,
                ]);
                $imageUrl = null;
            }

            return Inertia::render('Admin/PlantDisease/result', [
                'diagnosis' => $diagnosis,
                'imageUrl' => $imageUrl,
                'plantName' => $plantName,
            ]);
        } catch (\Exception $e) {
            // Clean up on exception
            if ($imagePath) {
                try {
                    Storage::disk('public')->delete($imagePath);
                } catch (\Exception $deleteException) {
                    Log::warning('Failed to delete image on error', [
                        'path' => $imagePath,
                        'error' => $deleteException->getMessage(),
                    ]);
                }
            }
            
            Log::error('Plant Disease Detection Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'image' => 'An error occurred while analyzing the image. Please try again.',
            ]);
        }
    }
}

