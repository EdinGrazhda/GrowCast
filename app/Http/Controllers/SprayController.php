<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Plant;
use App\Models\Spray;
use App\Models\Weather;
use App\Services\OpenAIService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SprayController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Spray::class);

        $user = Auth::user();

        // Get sprays with their relationships
        $sprays = Spray::with(['farm', 'plant'])
            ->whereHas('farm', function ($query) use ($user) {
                if (! $user->hasRole('admin')) {
                    $query->where('user_id', $user->id);
                }
            })
            ->latest()
            ->get();

        return Inertia::render('Admin/Sprays/index', [
            'sprays' => $sprays,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Spray::class);

        $user = Auth::user();

        // Get farms and plants for the user
        $farms = $user->hasRole('admin')
            ? Farm::with('plant')->get()
            : Farm::where('user_id', $user->id)->with('plant')->get();

        $plants = $user->hasRole('admin')
            ? Plant::all()
            : Plant::where('user_id', $user->id)->get();

        return Inertia::render('Admin/Sprays/create', [
            'farms' => $farms,
            'plants' => $plants,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Spray::class);

        $validated = $request->validate([
            'farm_id' => 'required|exists:farm,id',
            'plant_id' => 'required|exists:plant,id',
            'spray_name' => 'required|string|max:255',
            'chemical_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'plant_pest' => 'nullable|string|max:255',
            'dosage' => 'required|string|max:255',
            'application_rate' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'application_date' => 'required|date',
            'season' => 'nullable|string|max:255',
            'month' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        Spray::create($validated);

        return redirect('/sprays');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $spray = Spray::with(['farm', 'plant'])->findOrFail($id);
        $this->authorize('view', $spray);

        return Inertia::render('Admin/Sprays/show', [
            'spray' => $spray,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $spray = Spray::with(['farm', 'plant'])->findOrFail($id);
        $this->authorize('update', $spray);

        $user = Auth::user();

        // Get farms and plants for the user
        $farms = $user->hasRole('admin')
            ? Farm::with('plant')->get()
            : Farm::where('user_id', $user->id)->with('plant')->get();

        $plants = $user->hasRole('admin')
            ? Plant::all()
            : Plant::where('user_id', $user->id)->get();

        return Inertia::render('Admin/Sprays/edit', [
            'spray' => $spray,
            'farms' => $farms,
            'plants' => $plants,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $spray = Spray::findOrFail($id);
        $this->authorize('update', $spray);

        $validated = $request->validate([
            'farm_id' => 'required|exists:farm,id',
            'plant_id' => 'required|exists:plant,id',
            'spray_name' => 'required|string|max:255',
            'chemical_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'plant_pest' => 'nullable|string|max:255',
            'dosage' => 'required|string|max:255',
            'application_rate' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'application_date' => 'required|date',
            'season' => 'nullable|string|max:255',
            'month' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $spray->update($validated);

        return redirect('/sprays');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $spray = Spray::findOrFail($id);
        $this->authorize('delete', $spray);

        $spray->delete();

        return redirect('/sprays');
    }

    /**
     * Get AI-powered spray timing recommendation for a specific plant and farm
     */
    public function getRecommendation(Request $request)
    {
        try {
            $validated = $request->validate([
                'plant_id' => 'required|exists:plant,id',
                'farm_id' => 'required|exists:farm,id',
                'spray_name' => 'nullable|string',
                'chemical_name' => 'nullable|string',
                'purpose' => 'nullable|string',
                'plant_pest' => 'nullable|string',
                'dosage' => 'nullable|string',
                'frequency' => 'nullable|string',
            ]);

            $plant = Plant::findOrFail($validated['plant_id']);
            $farm = Farm::with('plant')->findOrFail($validated['farm_id']);

            // Check authorization
            $user = Auth::user();
            if (! $user->hasRole('admin') && $farm->user_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Get spray history for this plant and farm
            $sprayHistory = Spray::where('plant_id', $validated['plant_id'])
                ->where('farm_id', $validated['farm_id'])
                ->orderBy('application_date', 'desc')
                ->limit(10)
                ->get()
                ->toArray();

            // Get current weather conditions for this plant
            $currentWeather = Weather::where('plant_id', $validated['plant_id'])
                ->latest()
                ->first();

            // Get weather forecast (if available from your weather service)
            // For now, we'll use recent weather data as a forecast proxy
            $weatherForecast = Weather::where('plant_id', $validated['plant_id'])
                ->latest()
                ->limit(7)
                ->get()
                ->map(function ($weather, $index) {
                    return [
                        'date' => now()->addDays($index)->format('Y-m-d'),
                        'temperature' => $weather->temperature,
                        'humidity' => $weather->humidity,
                        'wind_speed' => $weather->wind_speed,
                        'air_pressure' => $weather->air_pressure,
                        'status' => $weather->status,
                    ];
                })
                ->toArray();

            $weatherData = [
                'current' => $currentWeather ? [
                    'temperature' => $currentWeather->temperature,
                    'humidity' => $currentWeather->humidity,
                    'wind_speed' => $currentWeather->wind_speed,
                    'air_pressure' => $currentWeather->air_pressure,
                    'status' => $currentWeather->status,
                ] : null,
                'forecast' => $weatherForecast,
            ];

            // Prepare current spray data if provided
            $currentSpray = null;
            if (! empty($validated['spray_name'])) {
                $currentSpray = [
                    'spray_name' => $validated['spray_name'] ?? '',
                    'chemical_name' => $validated['chemical_name'] ?? '',
                    'purpose' => $validated['purpose'] ?? '',
                    'plant_pest' => $validated['plant_pest'] ?? '',
                    'dosage' => $validated['dosage'] ?? '',
                    'frequency' => $validated['frequency'] ?? '',
                ];
            }

            // Get AI recommendation
            $openAIService = new OpenAIService;
            $recommendation = $openAIService->getSprayRecommendation(
                $plant->toArray(),
                $farm->toArray(),
                $weatherData,
                $sprayHistory,
                $currentSpray
            );

            if (! $recommendation) {
                return response()->json([
                    'error' => 'Unable to generate recommendation. Please try again.',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'recommendation' => $recommendation,
                'plant' => $plant,
                'farm' => $farm,
                'sprayHistory' => $sprayHistory,
                'currentWeather' => $currentWeather,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Spray Recommendation Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'An error occurred while generating the recommendation.',
            ], 500);
        }
    }

    /**
     * Show spray recommendation page for a specific spray
     */
    public function recommendationPage(?string $id = null)
    {
        $user = Auth::user();

        // Get farms and plants for the user
        $farms = $user->hasRole('admin')
            ? Farm::with('plant')->get()
            : Farm::where('user_id', $user->id)->with('plant')->get();

        // Plants are shared across all users
        $plants = Plant::all();

        // Get all unique sprays (distinct spray names with their details)
        $allSprays = Spray::with(['farm', 'plant'])
            ->whereHas('farm', function ($query) use ($user) {
                if (! $user->hasRole('admin')) {
                    $query->where('user_id', $user->id);
                }
            })
            ->get()
            ->unique(function ($spray) {
                return $spray->spray_name.$spray->chemical_name.$spray->plant_id;
            })
            ->values();

        $spray = null;
        if ($id) {
            $spray = Spray::with(['farm', 'plant'])->findOrFail($id);
            $this->authorize('view', $spray);
        }

        return Inertia::render('Admin/Sprays/recommendation', [
            'farms' => $farms,
            'plants' => $plants,
            'allSprays' => $allSprays,
            'spray' => $spray,
        ]);
    }

    /**
     * Get sprays for a specific plant (AJAX endpoint)
     */
    public function getSpraysByPlant(Request $request)
    {
        Log::info('getSpraysByPlant called', [
            'request_data' => $request->all(),
        ]);

        $validated = $request->validate([
            'plant_id' => 'required|exists:plant,id',
        ]);

        $user = Auth::user();

        // Get all sprays for this plant
        // For admins, get all sprays, for regular users get sprays from their farms
        $query = Spray::with(['farm', 'plant'])
            ->where('plant_id', $validated['plant_id']);

        // Only filter by user if not admin
        if (!$user->hasRole('admin')) {
            $query->whereHas('farm', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $sprays = $query
            ->orderBy('application_date', 'desc')
            ->get();

        // Log for debugging
        Log::info('Fetching sprays for plant', [
            'plant_id' => $validated['plant_id'],
            'user_id' => $user->id,
            'is_admin' => $user->hasRole('admin'),
            'sprays_count' => $sprays->count(),
            'sprays_data' => $sprays->toArray(),
        ]);

        return response()->json([
            'success' => true,
            'sprays' => $sprays,
        ]);
    }
}
