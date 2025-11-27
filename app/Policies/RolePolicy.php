<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any roles.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $this->hasPermission($user, 'role_View');
    }

    /**
     * Determine whether the user can view the role.
     */
    public function view(User $user, Role $role): bool
    {
        return $user->hasRole('admin') || $this->hasPermission($user, 'role_View');
    }

    /**
     * Determine whether the user can create roles.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $this->hasPermission($user, 'role_Create');
    }

    /**
     * Determine whether the user can update the role.
     */
    public function update(User $user, Role $role): bool
    {
        return $user->hasRole('admin') || $this->hasPermission($user, 'role_Edit');
    }

    /**
     * Determine whether the user can delete the role.
     */
    public function delete(User $user, Role $role): bool
    {
        return $user->hasRole('admin') || $this->hasPermission($user, 'role_Delete');
    }

    /**
     * Check if the user has the given permission through their roles.
     */
    private function hasPermission(User $user, string $permission): bool
    {
        foreach ($user->roles as $role) {
            if ($role->hasPermissionTo($permission)) {
                return true;
            }
        }
        return false;
    }
}
