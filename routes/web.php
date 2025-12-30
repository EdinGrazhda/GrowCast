<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\PlantDiseaseController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SprayController;
use App\Http\Controllers\UserController;
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
    // Dashboard - accessible by all authenticated users
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Resource routes - authorization handled by policies
    Route::resource('farms', FarmController::class);
    Route::resource('plants', PlantController::class);
    Route::resource('sprays', SprayController::class);
    Route::resource('weather', WeatherController::class);
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);

    // Weather forecast route
    Route::post('weather/forecast', [WeatherController::class, 'getForecast'])->name('weather.forecast');

    // Plant disease detection routes
    Route::get('plant-disease', [PlantDiseaseController::class, 'index'])->name('plant-disease.index');
    Route::post('plant-disease/detect', [PlantDiseaseController::class, 'detect'])->name('plant-disease.detect');

    // User role management routes
    Route::get('users/{user}/assign-role', [UserController::class, 'assignRolePage'])->name('users.assign-role');
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.assign-role.post');
    Route::post('users/{user}/remove-role', [UserController::class, 'removeRole'])->name('users.remove-role');
    Route::post('users/{user}/sync-roles', [UserController::class, 'syncRoles'])->name('users.sync-roles');

    // Role assignment page
    Route::get('roles/{id}/assignment', [RoleController::class, 'assignment'])->name('roles.assignment');

    // Role permission management routes
    Route::post('roles/{id}/assign-permission', [RoleController::class, 'assignPermission'])->name('roles.assign-permission');
    Route::post('roles/{id}/revoke-permission', [RoleController::class, 'revokePermission'])->name('roles.revoke-permission');
    Route::post('roles/{id}/assign-permissions', [RoleController::class, 'assignPermissions'])->name('roles.assign-permissions');
    Route::post('roles/{id}/sync-permissions', [RoleController::class, 'syncPermissions'])->name('roles.sync-permissions');
});

require __DIR__.'/settings.php';
