<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plants = Plant::withCount(['farms', 'weathers'])->latest()->get();
        
        return Inertia::render('Admin/Plants/index', [
            'plants' => $plants
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Plants/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'info' => 'nullable|string',
        ]);

        Plant::create($validated);

        return redirect('/plants');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $plant = Plant::with(['farms', 'weathers'])->findOrFail($id);
        
        return Inertia::render('Admin/Plants/show', [
            'plant' => $plant
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $plant = Plant::findOrFail($id);
        
        return Inertia::render('Admin/Plants/edit', [
            'plant' => $plant
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $plant = Plant::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'info' => 'nullable|string',
        ]);

        $plant->update($validated);

        return redirect('/plants');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $plant = Plant::findOrFail($id);
        $plant->delete();

        return redirect('/plants');
    }
}
