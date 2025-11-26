<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weather extends Model
{
    protected $table = 'weather';

    protected $fillable = [
        'temperature',
        'humidity',
        'air_pressure',
        'wind_speed',
        'plant_id',
        'farm_id',
        'status',
        'recommendation',
        'best_planting_day',
    ];

    public function plant()
    {
        return $this->belongsTo(Plant::class);
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
