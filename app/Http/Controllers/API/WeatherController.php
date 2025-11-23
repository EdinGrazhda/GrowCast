<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Weather;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WeatherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $weathers = Weather::with(['plant'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $weathers
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'temperature' => 'required|numeric',
            'humidity' => 'required|numeric|min:0|max:100',
            'air_pressure' => 'required|numeric',
            'wind_speed' => 'required|numeric|min:0',
            'plant_id' => 'required|exists:plant,id',
            'status' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $weather = Weather::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Weather data created successfully',
            'data' => $weather->load('plant')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $weather = Weather::with(['plant'])->find($id);

        if (!$weather) {
            return response()->json([
                'success' => false,
                'message' => 'Weather data not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $weather
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $weather = Weather::find($id);

        if (!$weather) {
            return response()->json([
                'success' => false,
                'message' => 'Weather data not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'temperature' => 'sometimes|required|numeric',
            'humidity' => 'sometimes|required|numeric|min:0|max:100',
            'air_pressure' => 'sometimes|required|numeric',
            'wind_speed' => 'sometimes|required|numeric|min:0',
            'plant_id' => 'sometimes|required|exists:plant,id',
            'status' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $weather->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Weather data updated successfully',
            'data' => $weather->load('plant')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $weather = Weather::find($id);

        if (!$weather) {
            return response()->json([
                'success' => false,
                'message' => 'Weather data not found'
            ], 404);
        }

        $weather->delete();

        return response()->json([
            'success' => true,
            'message' => 'Weather data deleted successfully'
        ], 200);
    }
}
