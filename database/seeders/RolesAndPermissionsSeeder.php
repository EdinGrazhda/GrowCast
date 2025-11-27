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

        // Permissions are already created by migration (plant_View, plant_Create, etc.)
        // Just create roles without assigning any permissions by default
        
        // Create Admin role (permissions will be assigned manually via UI)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Create Farmer role (permissions will be assigned manually via UI)
        $farmerRole = Role::firstOrCreate(['name' => 'farmer']);

        $this->command->info('Roles created successfully! Assign permissions via the UI.');
    }
}
