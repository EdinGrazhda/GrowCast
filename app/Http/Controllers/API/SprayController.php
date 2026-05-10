<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Spray;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SprayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sprays = Spray::with(['farm', 'plant'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $sprays
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
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

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $spray = Spray::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Spray record created successfully',
            'data' => $spray
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $spray = Spray::with(['farm', 'plant'])->find($id);

        if (!$spray) {
            return response()->json([
                'success' => false,
                'message' => 'Spray record not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $spray
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $spray = Spray::find($id);

        if (!$spray) {
            return response()->json([
                'success' => false,
                'message' => 'Spray record not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'farm_id' => 'sometimes|required|exists:farm,id',
            'plant_id' => 'sometimes|required|exists:plant,id',
            'spray_name' => 'sometimes|required|string|max:255',
            'chemical_name' => 'sometimes|required|string|max:255',
            'purpose' => 'sometimes|required|string|max:255',
            'plant_pest' => 'nullable|string|max:255',
            'dosage' => 'sometimes|required|string|max:255',
            'application_rate' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'application_date' => 'sometimes|required|date',
            'season' => 'nullable|string|max:255',
            'month' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $spray->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Spray record updated successfully',
            'data' => $spray
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $spray = Spray::find($id);

        if (!$spray) {
            return response()->json([
                'success' => false,
                'message' => 'Spray record not found'
            ], 404);
        }

        $spray->delete();

        return response()->json([
            'success' => true,
            'message' => 'Spray record deleted successfully'
        ], 200);
    }
}
