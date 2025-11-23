<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        // Devices permissions
        $permissions = [
            'plant_View',
            'plant_Create',
            'plant_Edit',
            'plant_Delete',
            'farm_View',
            'farm_Create',
            'farm_Edit',
            'farm_Delete',
            'weather_View',
            'weather_Create',
            'weather_Edit',
            'weather_Delete',
            'user_View',
            'user_Create',
            'user_Edit',
            'user_Delete',
            'role_View',
            'role_Create',
            'role_Edit',
            'role_Delete',
            'permission_View',
            'permission_Create',
            'permission_Edit',
            'permission_Delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $permissions = [
            'plant_View',
            'plant_Create',
            'plant_Edit',
            'plant_Delete',
            'farm_View',
            'farm_Create',
            'farm_Edit',
            'farm_Delete',
            'weather_View',
            'weather_Create',
            'weather_Edit',
            'weather_Delete',
            'user_View',
            'user_Create',
            'user_Edit',
            'user_Delete',
            'role_View',
            'role_Create',
            'role_Edit',
            'role_Delete',
            'permission_View',
            'permission_Create',
            'permission_Edit',
            'permission_Delete',
        ];

        foreach ($permissions as $permission) {
            Permission::findByName($permission)->delete();
        }
    }
};
