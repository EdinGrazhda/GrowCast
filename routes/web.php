<?php

use App\Http\Controllers\FarmController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\WeatherController;
use App\Models\Farm;
use App\Models\Plant;
use App\Models\Weather;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
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
            ],
        ]);
    })->name('dashboard');

    // Resource routes
    Route::resource('farms', FarmController::class);
    Route::resource('plants', PlantController::class);
    Route::resource('weather', WeatherController::class);
    Route::resource('roles', RoleController::class);

    // Weather forecast route
    Route::post('weather/forecast', [WeatherController::class, 'getForecast'])->name('weather.forecast');

    // Role assignment page
    Route::get('roles/{id}/assignment', [RoleController::class, 'assignment'])->name('roles.assignment');

    // Role permission management routes
    Route::post('roles/{id}/assign-permission', [RoleController::class, 'assignPermission'])->name('roles.assign-permission');
    Route::post('roles/{id}/revoke-permission', [RoleController::class, 'revokePermission'])->name('roles.revoke-permission');
    Route::post('roles/{id}/assign-permissions', [RoleController::class, 'assignPermissions'])->name('roles.assign-permissions');
    Route::post('roles/{id}/sync-permissions', [RoleController::class, 'syncPermissions'])->name('roles.sync-permissions');
});

require __DIR__.'/settings.php';
