<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Plant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FarmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $farms = Farm::with(['user', 'plant'])->latest()->get();
        
        return Inertia::render('Admin/Farms/index', [
            'farms' => $farms
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();
        $plants = Plant::all();
        
        return Inertia::render('Admin/Farms/create', [
            'users' => $users,
            'plants' => $plants
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'longitute' => 'required|numeric',
            'latitude' => 'required|numeric',
            'user_id' => 'required|exists:users,id',
            'plant_id' => 'required|exists:plant,id',
        ]);

        Farm::create($validated);

        return redirect('/farms');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $farm = Farm::with(['user', 'plant'])->findOrFail($id);
        
        return Inertia::render('Admin/Farms/show', [
            'farm' => $farm
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $farm = Farm::findOrFail($id);
        $users = User::all();
        $plants = Plant::all();
        
        return Inertia::render('Admin/Farms/edit', [
            'farm' => $farm,
            'users' => $users,
            'plants' => $plants
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $farm = Farm::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'longitute' => 'required|numeric',
            'latitude' => 'required|numeric',
            'user_id' => 'required|exists:users,id',
            'plant_id' => 'required|exists:plant,id',
        ]);

        $farm->update($validated);

        return redirect('/farms');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $farm = Farm::findOrFail($id);
        $farm->delete();

        return redirect('/farms');
    }
}
