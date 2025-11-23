<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Farm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FarmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $farms = Farm::with(['user', 'plant'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $farms
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'longitute' => 'required|numeric',
            'latitude' => 'required|numeric',
            'user_id' => 'required|exists:users,id',
            'plant_id' => 'required|exists:plant,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $farm = Farm::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Farm created successfully',
            'data' => $farm->load(['user', 'plant'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $farm = Farm::with(['user', 'plant'])->find($id);

        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $farm
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $farm = Farm::find($id);

        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'longitute' => 'sometimes|required|numeric',
            'latitude' => 'sometimes|required|numeric',
            'user_id' => 'sometimes|required|exists:users,id',
            'plant_id' => 'sometimes|required|exists:plant,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $farm->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Farm updated successfully',
            'data' => $farm->load(['user', 'plant'])
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $farm = Farm::find($id);

        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found'
            ], 404);
        }

        $farm->delete();

        return response()->json([
            'success' => true,
            'message' => 'Farm deleted successfully'
        ], 200);
    }
}
