<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Plant;
use App\Models\Spray;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SprayController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Spray::class);

        $user = Auth::user();

        // Get sprays with their relationships
        $sprays = Spray::with(['farm', 'plant'])
            ->whereHas('farm', function ($query) use ($user) {
                if (!$user->hasRole('admin')) {
                    $query->where('user_id', $user->id);
                }
            })
            ->latest()
            ->get();

        return Inertia::render('Admin/Sprays/index', [
            'sprays' => $sprays,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Spray::class);

        $user = Auth::user();

        // Get farms and plants for the user
        $farms = $user->hasRole('admin')
            ? Farm::with('plant')->get()
            : Farm::where('user_id', $user->id)->with('plant')->get();

        $plants = $user->hasRole('admin')
            ? Plant::all()
            : Plant::where('user_id', $user->id)->get();

        return Inertia::render('Admin/Sprays/create', [
            'farms' => $farms,
            'plants' => $plants,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Spray::class);

        $validated = $request->validate([
            'farm_id' => 'required|exists:farm,id',
            'plant_id' => 'required|exists:plant,id',
            'spray_name' => 'required|string|max:255',
            'chemical_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'plant_pest' => 'nullable|string|max:255',
            'dosage' => 'required|string|max:255',
            'application_rate' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'application_date' => 'required|date',
            'season' => 'nullable|string|max:255',
            'month' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        Spray::create($validated);

        return redirect('/sprays');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $spray = Spray::with(['farm', 'plant'])->findOrFail($id);
        $this->authorize('view', $spray);

        return Inertia::render('Admin/Sprays/show', [
            'spray' => $spray,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $spray = Spray::with(['farm', 'plant'])->findOrFail($id);
        $this->authorize('update', $spray);

        $user = Auth::user();

        // Get farms and plants for the user
        $farms = $user->hasRole('admin')
            ? Farm::with('plant')->get()
            : Farm::where('user_id', $user->id)->with('plant')->get();

        $plants = $user->hasRole('admin')
            ? Plant::all()
            : Plant::where('user_id', $user->id)->get();

        return Inertia::render('Admin/Sprays/edit', [
            'spray' => $spray,
            'farms' => $farms,
            'plants' => $plants,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $spray = Spray::findOrFail($id);
        $this->authorize('update', $spray);

        $validated = $request->validate([
            'farm_id' => 'required|exists:farm,id',
            'plant_id' => 'required|exists:plant,id',
            'spray_name' => 'required|string|max:255',
            'chemical_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'plant_pest' => 'nullable|string|max:255',
            'dosage' => 'required|string|max:255',
            'application_rate' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'application_date' => 'required|date',
            'season' => 'nullable|string|max:255',
            'month' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $spray->update($validated);

        return redirect('/sprays');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $spray = Spray::findOrFail($id);
        $this->authorize('delete', $spray);

        $spray->delete();

        return redirect('/sprays');
    }
}
