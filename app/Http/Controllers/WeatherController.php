<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Weather;
use App\Services\OpenAIService;
use App\Services\OpenWeatherService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WeatherController extends Controller
{
    use AuthorizesRequests;
    protected $weatherService;

    protected $aiService;

    public function __construct(OpenWeatherService $weatherService, OpenAIService $aiService)
    {
        $this->weatherService = $weatherService;
        $this->aiService = $aiService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Weather::class);
        
        $user = Auth::user();
        
        // Admins see all weather records, others see only their own (through farms)
        $weathers = $user->hasRole('admin')
            ? Weather::with(['plant', 'farm'])->latest()->get()
            : Weather::with(['plant', 'farm'])
                ->whereHas('farm', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->latest()->get();

        return Inertia::render('Admin/Weather/index', [
            'weathers' => $weathers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Weather::class);
        
        $user = Auth::user();
        
        // Admins see all farms, others see only their own
        $farms = $user->hasRole('admin')
            ? Farm::with(['plant', 'user'])->get()
            : Farm::with(['plant', 'user'])->where('user_id', $user->id)->get();

        return Inertia::render('Admin/Weather/create', [
            'farms' => $farms,
        ]);
    }

    /**
     * Get weather forecast and AI recommendation
     */
    public function getForecast(Request $request)
    {
        $request->validate([
            'farm_id' => 'required|exists:farm,id',
        ]);

        $farm = Farm::with('plant')->findOrFail($request->farm_id);

        // Get 40-day weather forecast
        $forecast = $this->weatherService->getForecast($farm->latitude, $farm->longitute, 40);

        if (! $forecast) {
            return response()->json([
                'error' => 'Failed to fetch weather forecast',
            ], 500);
        }

        // Get AI recommendation
        $farmData = [
            'name' => $farm->name,
            'latitude' => $farm->latitude,
            'longitude' => $farm->longitute,
        ];

        $plantData = [
            'name' => $farm->plant->name,
            'info' => $farm->plant->info ?? 'No specific information available',
        ];

        $recommendation = $this->aiService->getPlantingRecommendation($farmData, $plantData, $forecast);

        // Analyze each day and assign status
        $analyzedForecast = $this->analyzeForecastDays($forecast, $farm->plant);

        // Extract best days
        $bestDays = $this->extractBestDays($analyzedForecast);

        // Extract overall status
        $status = $this->extractStatus($recommendation);

        // Calculate average weather conditions
        $avgWeather = $this->calculateAverageWeather($forecast);

        return response()->json([
            'forecast' => $analyzedForecast,
            'recommendation' => $recommendation,
            'status' => $status,
            'best_days' => $bestDays,
            'average_conditions' => $avgWeather,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Weather::class);
        
        $validated = $request->validate([
            'farm_id' => 'required|exists:farm,id',
            'recommendation' => 'required|string',
            'status' => 'required|in:optimal,acceptable,poor',
            'best_planting_day' => 'required|string',
            'temperature' => 'required|numeric',
            'humidity' => 'required|numeric|min:0|max:100',
            'air_pressure' => 'required|numeric',
            'wind_speed' => 'required|numeric|min:0',
        ]);

        $farm = Farm::with('plant')->findOrFail($validated['farm_id']);

        $validated['plant_id'] = $farm->plant_id;

        Weather::create($validated);

        return redirect('/weather');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $weather = Weather::with(['plant', 'farm'])->findOrFail($id);
        $this->authorize('view', $weather);

        return Inertia::render('Admin/Weather/show', [
            'weather' => $weather,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $weather = Weather::findOrFail($id);
        $this->authorize('delete', $weather);
        
        $weather->delete();

        return redirect('/weather');
    }

    /**
     * Helper methods for extracting data from AI recommendation
     */
    private function extractStatus(string $recommendation): string
    {
        // Look for status in recommendation (Optimal, Acceptable, Poor)
        if (stripos($recommendation, 'optimal') !== false) {
            return 'optimal';
        } elseif (stripos($recommendation, 'acceptable') !== false) {
            return 'acceptable';
        } else {
            return 'poor';
        }
    }

    private function analyzeForecastDays(array $forecast, $plant): array
    {
        $analyzedDays = [];

        foreach ($forecast as $day) {
            // Determine status based on weather conditions AND plant requirements
            $status = $this->determineStatusForPlant($day, $plant->name, $plant->info ?? '');

            $analyzedDays[] = array_merge($day, [
                'status' => $status,
                'is_best' => false, // Will be updated later
            ]);
        }

        return $analyzedDays;
    }

    /**
     * Determine weather status based on specific plant requirements
     * Dynamically analyzes plant name and description to categorize
     */
    private function determineStatusForPlant(array $day, string $plantName, string $plantInfo = ''): string
    {
        $temp = $day['temperature'] ?? 20;
        $humidity = $day['humidity'] ?? 50;
        $windSpeed = $day['wind_speed'] ?? 0;
        $precip = $day['precipitation_probability'] ?? 0;
        
        $plantName = strtolower($plantName);
        $plantInfo = strtolower($plantInfo);
        
        // Analyze plant type from name and info
        $isCoolSeason = $this->isCoolSeasonPlant($plantName, $plantInfo);
        $isWarmSeason = $this->isWarmSeasonPlant($plantName, $plantInfo);
        
        if ($isCoolSeason) {
            return $this->evaluateCoolSeasonCrop($temp, $humidity, $windSpeed, $precip);
        }
        
        if ($isWarmSeason) {
            return $this->evaluateWarmSeasonCrop($temp, $humidity, $windSpeed, $precip);
        }
        
        // Default to moderate season
        return $this->evaluateModerateSeasonCrop($temp, $humidity, $windSpeed, $precip);
    }

    /**
     * Check if plant is a cool-season crop based on name and description
     */
    private function isCoolSeasonPlant(string $name, string $info): bool
    {
        $coolSeasonIndicators = [
            'spinach', 'lettuce', 'carrot', 'peas', 'broccoli', 'cabbage', 
            'kale', 'radish', 'turnip', 'beet', 'cool season', 'cool weather',
            'frost tolerant', 'cool temperature', 'spring crop', 'fall crop',
            '10-20', '15-20', 'cool', 'cold tolerant'
        ];
        
        foreach ($coolSeasonIndicators as $indicator) {
            if (stripos($name, $indicator) !== false || stripos($info, $indicator) !== false) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if plant is a warm-season crop based on name and description
     */
    private function isWarmSeasonPlant(string $name, string $info): bool
    {
        $warmSeasonIndicators = [
            'tomato', 'pepper', 'cucumber', 'melon', 'squash', 'eggplant',
            'warm season', 'warm weather', 'heat loving', 'frost sensitive',
            'hot weather', 'summer crop', '20-25', '25-30', '20-30',
            'warm temperature', 'tropical', 'subtropical'
        ];
        
        foreach ($warmSeasonIndicators as $indicator) {
            if (stripos($name, $indicator) !== false || stripos($info, $indicator) !== false) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Evaluate conditions for cool-season crops (prefer 10-20°C)
     */
    private function evaluateCoolSeasonCrop($temp, $humidity, $windSpeed, $precip): string
    {
        $score = 0;
        
        // Cool crops LOVE cool weather
        if ($temp >= 10 && $temp <= 20) {
            $score += 3; // Perfect!
        } elseif ($temp >= 5 && $temp < 10 || $temp > 20 && $temp <= 24) {
            $score += 2; // Still good
        } elseif ($temp >= 0 && $temp < 5) {
            $score += 1; // Can tolerate
        }
        // Hot weather is BAD for cool crops (score 0)
        
        if ($humidity >= 50 && $humidity <= 80) $score += 2;
        elseif ($humidity >= 40 && $humidity < 50 || $humidity > 80 && $humidity <= 90) $score += 1;
        
        if ($windSpeed < 5) $score += 2;
        elseif ($windSpeed < 10) $score += 1;
        
        if ($precip < 40) $score += 2;
        elseif ($precip < 70) $score += 1;
        
        if ($score >= 7) return 'optimal';
        if ($score >= 4) return 'acceptable';
        return 'poor';
    }

    /**
     * Evaluate conditions for warm-season crops (prefer 20-28°C)
     */
    private function evaluateWarmSeasonCrop($temp, $humidity, $windSpeed, $precip): string
    {
        $score = 0;
        
        // Warm crops NEED warmth
        if ($temp >= 20 && $temp <= 28) {
            $score += 3; // Perfect!
        } elseif ($temp >= 15 && $temp < 20 || $temp > 28 && $temp <= 32) {
            $score += 2; // Acceptable
        } elseif ($temp >= 10 && $temp < 15) {
            $score += 1; // Too cool but survivable
        }
        // Cold weather is BAD for warm crops (score 0)
        
        if ($humidity >= 60 && $humidity <= 75) $score += 2;
        elseif ($humidity >= 50 && $humidity < 60 || $humidity > 75 && $humidity <= 85) $score += 1;
        
        if ($windSpeed < 5) $score += 2;
        elseif ($windSpeed < 10) $score += 1;
        
        if ($precip < 30) $score += 2;
        elseif ($precip < 60) $score += 1;
        
        if ($score >= 7) return 'optimal';
        if ($score >= 4) return 'acceptable';
        return 'poor';
    }

    /**
     * Evaluate conditions for moderate-season crops (prefer 15-22°C)
     */
    private function evaluateModerateSeasonCrop($temp, $humidity, $windSpeed, $precip): string
    {
        $score = 0;
        
        if ($temp >= 15 && $temp <= 22) {
            $score += 3;
        } elseif ($temp >= 10 && $temp < 15 || $temp > 22 && $temp <= 26) {
            $score += 2;
        } elseif ($temp >= 7 && $temp < 10 || $temp > 26 && $temp <= 30) {
            $score += 1;
        }
        
        if ($humidity >= 60 && $humidity <= 80) $score += 2;
        elseif ($humidity >= 50 && $humidity < 60 || $humidity > 80 && $humidity <= 90) $score += 1;
        
        if ($windSpeed < 5) $score += 2;
        elseif ($windSpeed < 10) $score += 1;
        
        if ($precip < 35) $score += 2;
        elseif ($precip < 65) $score += 1;
        
        if ($score >= 7) return 'optimal';
        if ($score >= 4) return 'acceptable';
        return 'poor';
    }

    private function determineStatus(array $day): string
    {
        $temp = $day['temperature'] ?? 20;
        $humidity = $day['humidity'] ?? 50;
        $windSpeed = $day['wind_speed'] ?? 0;
        $precip = $day['precipitation_probability'] ?? 0;

        $score = 0;

        // Temperature scoring (ideal: 15-25°C)
        if ($temp >= 15 && $temp <= 25) {
            $score += 3;
        } elseif ($temp >= 10 && $temp < 15 || $temp > 25 && $temp <= 30) {
            $score += 2;
        } elseif ($temp >= 5 && $temp < 10 || $temp > 30 && $temp <= 35) {
            $score += 1;
        }

        // Humidity scoring (ideal: 40-70%)
        if ($humidity >= 40 && $humidity <= 70) {
            $score += 2;
        } elseif ($humidity >= 30 && $humidity < 40 || $humidity > 70 && $humidity <= 80) {
            $score += 1;
        }

        // Wind speed scoring (ideal: < 5 m/s)
        if ($windSpeed < 5) {
            $score += 2;
        } elseif ($windSpeed >= 5 && $windSpeed < 10) {
            $score += 1;
        }

        // Precipitation scoring (ideal: < 30%)
        if ($precip < 30) {
            $score += 2;
        } elseif ($precip >= 30 && $precip < 60) {
            $score += 1;
        }

        // Determine status based on total score
        // Max score: 9, Optimal: 7-9, Acceptable: 4-6, Poor: 0-3
        if ($score >= 7) {
            return 'optimal';
        } elseif ($score >= 4) {
            return 'acceptable';
        }

        return 'poor';
    }

    private function extractBestDays(array $forecast): array
    {
        // Filter optimal days
        $optimalDays = array_filter($forecast, fn ($day) => $day['status'] === 'optimal');

        // If we have optimal days, return them (up to 5)
        if (! empty($optimalDays)) {
            $bestDays = array_slice($optimalDays, 0, 5);
            // Mark them as best in the main forecast
            foreach ($forecast as &$day) {
                foreach ($bestDays as $best) {
                    if ($day['date'] === $best['date']) {
                        $day['is_best'] = true;
                    }
                }
            }

            return array_values($bestDays);
        }

        // If no optimal days, return acceptable days (up to 5)
        $acceptableDays = array_filter($forecast, fn ($day) => $day['status'] === 'acceptable');
        $bestDays = array_slice($acceptableDays, 0, 5);

        // Mark them as best
        foreach ($forecast as &$day) {
            foreach ($bestDays as $best) {
                if ($day['date'] === $best['date']) {
                    $day['is_best'] = true;
                }
            }
        }

        return array_values($bestDays);
    }

    private function calculateAverageWeather(array $forecast): array
    {
        $totals = [
            'temperature' => 0,
            'humidity' => 0,
            'air_pressure' => 0,
            'wind_speed' => 0,
        ];

        $count = count($forecast);

        foreach ($forecast as $day) {
            $totals['temperature'] += $day['temperature'];
            $totals['humidity'] += $day['humidity'];
            $totals['air_pressure'] += $day['air_pressure'];
            $totals['wind_speed'] += $day['wind_speed'];
        }

        return [
            'temperature' => round($totals['temperature'] / $count, 1),
            'humidity' => round($totals['humidity'] / $count, 1),
            'air_pressure' => round($totals['air_pressure'] / $count, 1),
            'wind_speed' => round($totals['wind_speed'] / $count, 1),
        ];
    }
}
