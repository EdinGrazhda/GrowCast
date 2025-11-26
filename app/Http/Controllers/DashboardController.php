<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Plant;
use App\Models\Weather;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics
     */
    public function index()
    {
        // Gather statistics
        $totalFarms = Farm::count();
        $totalPlants = Plant::count();
        $totalWeatherForecasts = Weather::count();
        $optimalDays = Weather::where('status', 'optimal')->count();
        
        // Recent forecasts with relationships
        $recentForecasts = Weather::with(['farm', 'plant'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($weather) {
                return [
                    'id' => $weather->id,
                    'farm_name' => $weather->farm->name ?? 'Unknown',
                    'plant_name' => $weather->plant->name ?? 'Unknown',
                    'status' => $weather->status,
                    'best_planting_day' => $weather->best_planting_day ?? 'N/A',
                    'created_at' => $weather->created_at,
                ];
            });
        
        // Plants by stock (top 5)
        $plantsByStock = Plant::orderBy('stock', 'desc')
            ->take(5)
            ->get(['name', 'stock']);
        
        return Inertia::render('dashboard', [
            'stats' => [
                'totalFarms' => $totalFarms,
                'totalPlants' => $totalPlants,
                'totalWeatherForecasts' => $totalWeatherForecasts,
                'optimalDays' => $optimalDays,
                'recentForecasts' => $recentForecasts,
                'plantsByStock' => $plantsByStock,
            ]
        ]);
    }
}
