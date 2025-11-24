<?php

use App\Http\Controllers\FarmController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\RoleController;
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
    })->name('dashboard');

    // Resource routes
    Route::resource('farms', FarmController::class);
    Route::resource('plants', PlantController::class);
    Route::resource('weather', WeatherController::class);
    Route::resource('roles', RoleController::class);

    // Role assignment page
    Route::get('roles/{id}/assignment', [RoleController::class, 'assignment'])->name('roles.assignment');

    // Role permission management routes
    Route::post('roles/{id}/assign-permission', [RoleController::class, 'assignPermission'])->name('roles.assign-permission');
    Route::post('roles/{id}/revoke-permission', [RoleController::class, 'revokePermission'])->name('roles.revoke-permission');
    Route::post('roles/{id}/assign-permissions', [RoleController::class, 'assignPermissions'])->name('roles.assign-permissions');
    Route::post('roles/{id}/sync-permissions', [RoleController::class, 'syncPermissions'])->name('roles.sync-permissions');
});

require __DIR__.'/settings.php';
