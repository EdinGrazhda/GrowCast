<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlantController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Plant::class);

        $user = Auth::user();

        // Admins see all plants, others see only their own
        $plants = $user->hasRole('admin')
            ? Plant::withCount(['farms', 'weathers'])->latest()->get()
            : Plant::withCount(['farms', 'weathers'])->where('user_id', $user->id)->latest()->get();

        return Inertia::render('Admin/Plants/index', [
            'plants' => $plants,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Plant::class);

        return Inertia::render('Admin/Plants/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Plant::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'info' => 'nullable|string',
        ]);

        // Set user_id to current user
        $validated['user_id'] = Auth::id();

        Plant::create($validated);

        return redirect('/plants');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $plant = Plant::with(['farms', 'weathers'])->findOrFail($id);
        $this->authorize('view', $plant);

        return Inertia::render('Admin/Plants/show', [
            'plant' => $plant,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $plant = Plant::findOrFail($id);
        $this->authorize('update', $plant);

        return Inertia::render('Admin/Plants/edit', [
            'plant' => $plant,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $plant = Plant::findOrFail($id);
        $this->authorize('update', $plant);

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
        $this->authorize('delete', $plant);

        $plant->delete();

        return redirect('/plants');
    }
}
