<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    private const TEST_USER_EMAIL = 'test@example.com';
    private const TEST_USER_PASSWORD = 'password';

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call(RolesAndPermissionsSeeder::class);

        // Create or update test user
        $wasNew = !User::where('email', self::TEST_USER_EMAIL)->exists();
        
        $user = User::updateOrCreate(
            ['email' => self::TEST_USER_EMAIL],
            [
                'name' => 'Test User',
                'password' => Hash::make(self::TEST_USER_PASSWORD),
                'email_verified_at' => now(),
            ]
        );

        // Sync admin role (removes other roles, ensures admin is assigned)
        $user->syncRoles('admin');

        if ($wasNew) {
            $this->command->info('Test user created: ' . self::TEST_USER_EMAIL . ' / ' . self::TEST_USER_PASSWORD);
        }
    }
}
