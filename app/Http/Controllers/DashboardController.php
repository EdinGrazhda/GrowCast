<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Plant;
use App\Models\Weather;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics
     */
    public function index()
    {
        // Check if user has permission to view dashboard
        if (! Auth::user()->can('dashboard_View')) {
            abort(403, 'Unauthorized access to dashboard.');
        }

        $user = Auth::user();
        $isAdmin = $user->hasRole('admin');

        // Gather statistics - scope to user unless admin
        $totalFarms = $isAdmin 
            ? Farm::count() 
            : Farm::where('user_id', $user->id)->count();
            
        $totalWeatherForecasts = $isAdmin 
            ? Weather::count() 
            : Weather::whereHas('farm', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })->count();
            
        $optimalDays = $isAdmin 
            ? Weather::where('status', 'optimal')->count() 
            : Weather::where('status', 'optimal')
                ->whereHas('farm', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })->count();

        // Recent forecasts with relationships - scope to user unless admin
        $recentForecastsQuery = Weather::with(['farm', 'plant'])->latest()->take(5);
        
        if (!$isAdmin) {
            $recentForecastsQuery->whereHas('farm', function($query) use ($user) {
                $query->where('user_id', $user->id);
            });
        }
        
        $recentForecasts = $recentForecastsQuery->get()
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

        // Show plants data
        $totalPlants = $isAdmin 
            ? Plant::count() 
            : Plant::where('user_id', $user->id)->count();
            
        $plantsByStock = $isAdmin
            ? Plant::orderBy('stock', 'desc')->take(5)->get(['name', 'stock'])
            : Plant::where('user_id', $user->id)->orderBy('stock', 'desc')->take(5)->get(['name', 'stock']);

        return Inertia::render('dashboard', [
            'stats' => [
                'totalFarms' => $totalFarms,
                'totalPlants' => $totalPlants,
                'totalWeatherForecasts' => $totalWeatherForecasts,
                'optimalDays' => $optimalDays,
                'recentForecasts' => $recentForecasts,
                'plantsByStock' => $plantsByStock,
            ],
        ]);
    }
}
