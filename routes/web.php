<?php

use App\Http\Controllers\FarmController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\WeatherController;
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
        return Inertia::render('dashboard');

        Route::resource('farms', FarmController::class);
        Route::resource('plants', PlantController::class);
        Route::resource('weather', WeatherController::class);
        
    })->name('dashboard');
    
   
});

require __DIR__.'/settings.php';
