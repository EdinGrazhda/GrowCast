<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use App\Models\Weather;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeatherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $weathers = Weather::with(['plant'])->latest()->get();
        
        return Inertia::render('weather/index', [
            'weathers' => $weathers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $plants = Plant::all();
        
        return Inertia::render('weather/create', [
            'plants' => $plants
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'temperature' => 'required|numeric',
            'humidity' => 'required|numeric|min:0|max:100',
            'air_pressure' => 'required|numeric',
            'wind_speed' => 'required|numeric|min:0',
            'plant_id' => 'required|exists:plant,id',
            'status' => 'required|string|max:255',
        ]);

        Weather::create($validated);

        return redirect()->route('weather.index')
            ->with('success', 'Weather data created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $weather = Weather::with(['plant'])->findOrFail($id);
        
        return Inertia::render('weather/show', [
            'weather' => $weather
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $weather = Weather::findOrFail($id);
        $plants = Plant::all();
        
        return Inertia::render('weather/edit', [
            'weather' => $weather,
            'plants' => $plants
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $weather = Weather::findOrFail($id);
        
        $validated = $request->validate([
            'temperature' => 'required|numeric',
            'humidity' => 'required|numeric|min:0|max:100',
            'air_pressure' => 'required|numeric',
            'wind_speed' => 'required|numeric|min:0',
            'plant_id' => 'required|exists:plant,id',
            'status' => 'required|string|max:255',
        ]);

        $weather->update($validated);

        return redirect()->route('weather.index')
            ->with('success', 'Weather data updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $weather = Weather::findOrFail($id);
        $weather->delete();

        return redirect()->route('weather.index')
            ->with('success', 'Weather data deleted successfully.');
    }
}
