<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Delete old unwanted permissions if they exist
        $oldPermissions = ['manage users', 'manage roles', 'manage farms', 'manage plants', 'manage weather', 'view dashboard'];
        Permission::whereIn('name', $oldPermissions)->delete();

        // Create Admin role - admins get all permissions automatically via Gate::before
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Create Farmer role and assign farming-related permissions
        $farmerRole = Role::firstOrCreate(['name' => 'farmer']);
        
        // Assign farmer permissions
        $farmerPermissions = [
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
        ];

        foreach ($farmerPermissions as $permission) {
            $perm = Permission::where('name', $permission)->first();
            if ($perm && !$farmerRole->hasPermissionTo($permission)) {
                $farmerRole->givePermissionTo($perm);
            }
        }

        $this->command->info('Roles and permissions assigned successfully!');
    }
}
