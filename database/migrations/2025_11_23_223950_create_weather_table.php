<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weather', function (Blueprint $table) {
            $table->id();
            $table->string('temperature');
            $table->string('humidity');
            $table->string('air_pressure');
            $table->string('wind_speed');
            $table->foreignId('plant_id')->constrained('plant')->onDelete('cascade');
            $table->enum('status', ['Optimal','Poor','Acceptable']);
            $table->timestamps();

            $table->index('id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather');
    }
};
