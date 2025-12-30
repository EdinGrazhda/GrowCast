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
        Schema::create('sprays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_id')->constrained('farm')->onDelete('cascade');
            $table->foreignId('plant_id')->constrained('plant')->onDelete('cascade');
            $table->string('spray_name');
            $table->string('chemical_name');
            $table->string('purpose');
            $table->string('plant_pest')->nullable();
            $table->string('dosage');
            $table->string('application_rate')->nullable();
            $table->string('frequency')->nullable();
            $table->date('application_date');
            $table->string('season')->nullable();
            $table->string('month')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['plant_id', 'farm_id', 'application_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sprays');
    }
};
