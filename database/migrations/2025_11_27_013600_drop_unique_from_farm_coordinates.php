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
        Schema::table('farm', function (Blueprint $table) {
            // Drop the accidental unique constraints on coordinates
            // Drop by column name (works even if the generated index name differs)
            if (Schema::hasColumn('farm', 'longitute')) {
                try {
                    $table->dropUnique(['longitute']);
                } catch (\Throwable $e) {
                    // ignore if index doesn't exist
                }
                // add a normal index for querying if desired
                $table->index('longitute');
            }

            if (Schema::hasColumn('farm', 'latitude')) {
                try {
                    $table->dropUnique(['latitude']);
                } catch (\Throwable $e) {
                    // ignore if index doesn't exist
                }
                $table->index('latitude');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farm', function (Blueprint $table) {
            // remove the non-unique indexes and restore unique constraints
            if (Schema::hasColumn('farm', 'longitute')) {
                try {
                    $table->dropIndex(['longitute']);
                } catch (\Throwable $e) {
                    // ignore
                }
                $table->unique('longitute');
            }

            if (Schema::hasColumn('farm', 'latitude')) {
                try {
                    $table->dropIndex(['latitude']);
                } catch (\Throwable $e) {
                    // ignore
                }
                $table->unique('latitude');
            }
        });
    }
};
