<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles first
        $this->call(RolesAndPermissionsSeeder::class);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@growcast.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        if (!$admin->hasRole('admin')) {
            $admin->assignRole($adminRole);
        }

        // Create a regular farmer user
        $farmer = User::firstOrCreate(
            ['email' => 'farmer@growcast.com'],
            [
                'name' => 'Farmer User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign farmer role
        $farmerRole = Role::firstOrCreate(['name' => 'farmer']);
        if (!$farmer->hasRole('farmer')) {
            $farmer->assignRole($farmerRole);
        }
    }
}
