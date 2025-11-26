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
        Schema::table('weather', function (Blueprint $table) {
            $table->foreignId('farm_id')->nullable()->after('plant_id')->constrained('farm')->onDelete('cascade');
            $table->text('recommendation')->nullable()->after('status');
            $table->string('best_planting_day')->nullable()->after('recommendation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('weather', function (Blueprint $table) {
            $table->dropForeign(['farm_id']);
            $table->dropColumn(['farm_id', 'recommendation', 'best_planting_day']);
        });
    }
};
