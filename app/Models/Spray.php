<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Spray extends Model
{
    protected $table = 'sprays';

    protected $fillable = [
        'farm_id',
        'chemical_name',
        'application_rate',
        'application_date',
        'notes',
        'season',
        'month',
        'plant_id',
        'purpose',
        'plant_pest',
        'spray_name',
        'dosage',
        'frequency',
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function plant()
    {
        return $this->belongsTo(Plant::class);
    }
}
