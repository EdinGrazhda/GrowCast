<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Plant;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FarmController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Farm::class);

        $user = Auth::user();

        // Admins see all farms, others see only their own
        $farms = $user->hasRole('admin')
            ? Farm::with(['user', 'plant'])->latest()->get()
            : Farm::with(['user', 'plant'])->where('user_id', $user->id)->latest()->get();

        return Inertia::render('Admin/Farms/index', [
            'farms' => $farms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Farm::class);

        $user = Auth::user();

        // Admins see all users and plants, others see only their own plants
        $users = $user->hasRole('admin') ? User::all() : collect([$user]);
        $plants = $user->hasRole('admin')
            ? Plant::all()
            : Plant::where('user_id', $user->id)->get();

        return Inertia::render('Admin/Farms/create', [
            'users' => $users,
            'plants' => $plants,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Farm::class);

        $user = Auth::user();

        // Clean up empty string values only for optional user_id field
        if ($request->has('user_id') && $request->input('user_id') === '') {
            $request->merge(['user_id' => null]);
        }

        $validationRules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'longitute' => 'required|numeric',
            'latitude' => 'required|numeric',
            'plant_id' => 'required|exists:plant,id',
        ];

        // Only validate user_id if admin
        if ($user->hasRole('admin')) {
            $validationRules['user_id'] = 'nullable|exists:users,id';
        }

        \Log::info('Farm Store - Request Data:', $request->all());
        \Log::info('Farm Store - Validation Rules:', $validationRules);

        $validated = $request->validate($validationRules);

        \Log::info('Farm Store - Validated Data:', $validated);

        // Set user_id to current user if not admin or not provided
        if (! $user->hasRole('admin') || ! isset($validated['user_id'])) {
            $validated['user_id'] = $user->id;
        }

        \Log::info('Farm Store - Final Data Before Create:', $validated);

        Farm::create($validated);

        return redirect('/farms');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $farm = Farm::with(['user', 'plant'])->findOrFail($id);
        $this->authorize('view', $farm);

        return Inertia::render('Admin/Farms/show', [
            'farm' => $farm,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $farm = Farm::findOrFail($id);
        $this->authorize('update', $farm);

        $user = Auth::user();

        // Admins see all users and plants, others see only their own plants
        $users = $user->hasRole('admin') ? User::all() : collect([$user]);
        $plants = $user->hasRole('admin')
            ? Plant::all()
            : Plant::where('user_id', $user->id)->get();

        return Inertia::render('Admin/Farms/edit', [
            'farm' => $farm,
            'users' => $users,
            'plants' => $plants,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $farm = Farm::findOrFail($id);
        $this->authorize('update', $farm);

        $user = Auth::user();

        $validationRules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'longitute' => 'required|numeric',
            'latitude' => 'required|numeric',
            'plant_id' => 'required|exists:plant,id',
        ];

        if ($user->hasRole('admin')) {
            $validationRules['user_id'] = 'nullable|exists:users,id';
        }

        $validated = $request->validate($validationRules);

        if (! $user->hasRole('admin') || ! isset($validated['user_id'])) {
            $validated['user_id'] = $farm->user_id;
        }

        $farm->update($validated);

        return redirect('/farms');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $farm = Farm::findOrFail($id);
        $this->authorize('delete', $farm);

        $farm->delete();

        return redirect('/farms');
    }
}
