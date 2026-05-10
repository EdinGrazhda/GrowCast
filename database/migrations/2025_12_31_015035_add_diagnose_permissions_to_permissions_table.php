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
        $permissions = [
            'diagnose_View',
            'diagnose_Create',
            'diagnose_Edit',
            'diagnose_Delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $permissions = [
            'diagnose_View',
            'diagnose_Create',
            'diagnose_Edit',
            'diagnose_Delete',
        ];

        foreach ($permissions as $permission) {
            $permissionModel = Permission::where('name', $permission)->first();
            if ($permissionModel) {
                $permissionModel->delete();
            }
        }
    }
};
