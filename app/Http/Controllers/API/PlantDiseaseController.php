<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlantDiseaseDetectionRequest;
use App\Services\OpenAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PlantDiseaseController extends Controller
{
    protected $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    /**
     * Analyze plant image for disease detection (API endpoint)
     */
    public function detect(PlantDiseaseDetectionRequest $request): JsonResponse
    {
        try {
            $image = $request->file('image');
            $plantName = $request->input('plant_name');

            // Store the image temporarily
            $imagePath = $image->store('temp/plant-disease', 'public');
            $fullPath = storage_path('app/public/'.$imagePath);

            // Analyze the image
            $diagnosis = $this->openAIService->analyzePlantDisease($fullPath, $plantName);

            // Clean up temporary file
            Storage::disk('public')->delete($imagePath);

            if ($diagnosis === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to analyze the image. Please try again.',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $diagnosis,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Plant Disease Detection API Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while analyzing the image.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}

