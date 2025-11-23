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
        'status',
    ];

    public function plant()
    {
        return $this->belongsTo(Plant::class);
    }
}
