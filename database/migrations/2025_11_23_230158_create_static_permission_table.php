<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Devices permissions
        $permissions = [
            'dashboard_View',
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
            'spray_View',
            'spray_Create',
            'spray_Edit',
            'spray_Delete',
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
            'diagnose_View',
            'diagnose_Create',
            'diagnose_Edit',
            'diagnose_Delete',
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
            'dashboard_View',
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
            'spray_View',
            'spray_Create',
            'spray_Edit',
            'spray_Delete',
            'diagnose_View',
            'diagnose_Create',
            'diagnose_Edit',
            'diagnose_Delete',
        ];

        foreach ($permissions as $permission) {
            Permission::findByName($permission)->delete();
        }
    }
};
