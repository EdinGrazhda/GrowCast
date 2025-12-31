<?php

use App\Http\Controllers\API\FarmController;
use App\Http\Controllers\API\PlantController;
use App\Http\Controllers\API\SprayController;
use App\Http\Controllers\API\PlantDiseaseController;
use App\Http\Controllers\API\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public route to get authenticated user info
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Protected API Routes - require authentication and admin/farmer role
Route::middleware(['auth:sanctum', 'role:admin,farmer'])->group(function () {
    // Farm API Routes
    Route::apiResource('farms', FarmController::class);

    // Plant API Routes
    Route::apiResource('plants', PlantController::class);

    // Spray API Routes
    Route::apiResource('sprays', SprayController::class);

    // Weather API Routes
    Route::apiResource('weather', WeatherController::class);

    // Plant Disease Detection API Routes
    Route::post('plant-disease/detect', [PlantDiseaseController::class, 'detect'])->name('api.plant-disease.detect');
});
