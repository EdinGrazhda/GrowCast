<?php

namespace App\Policies;

use App\Models\Farm;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FarmPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'farmer']) || $this->hasPermission($user, 'farm_View');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Farm $farm): bool
    {
        // Admin can view all, others can only view their own
        return $user->hasRole('admin') || 
               (($user->hasRole('farmer') || $this->hasPermission($user, 'farm_View')) && $farm->user_id === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'farmer']) || $this->hasPermission($user, 'farm_Create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Farm $farm): bool
    {
        // Admin can update all, others can only update their own
        return $user->hasRole('admin') || 
               (($user->hasRole('farmer') || $this->hasPermission($user, 'farm_Edit')) && $farm->user_id === $user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Farm $farm): bool
    {
        // Admin can delete all, others can only delete their own
        return $user->hasRole('admin') || 
               (($user->hasRole('farmer') || $this->hasPermission($user, 'farm_Delete')) && $farm->user_id === $user->id);
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

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Farm $farm): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Farm $farm): bool
    {
        return false;
    }
}
