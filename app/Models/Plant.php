<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    protected $table = 'plant';

    protected $fillable = [
        'name',
        'stock',
        'info',
    ];
    public function farms()
    {
        return $this->hasMany(Farm::class);
    }

    public function weathers()
    {
        return $this->hasMany(Weather::class);
    }
}
