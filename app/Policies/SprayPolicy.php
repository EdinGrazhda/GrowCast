<?php

namespace App\Policies;

use App\Models\Spray;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SprayPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'farmer']) || $this->hasPermission($user, 'spray_View');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Spray $spray): bool
    {
        // Admin can view all, farmers can view their own farm's sprays
        return $user->hasRole(['admin', 'farmer']) && 
               ($user->hasRole('admin') || $spray->farm->user_id === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'farmer']) || $this->hasPermission($user, 'spray_Create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Spray $spray): bool
    {
        // Admin can update all, farmers can only update their own farm's sprays
        return $user->hasRole(['admin', 'farmer']) && 
               ($user->hasRole('admin') || $spray->farm->user_id === $user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Spray $spray): bool
    {
        // Admin can delete all, farmers can only delete their own farm's sprays
        return $user->hasRole(['admin', 'farmer']) && 
               ($user->hasRole('admin') || $spray->farm->user_id === $user->id);
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
    public function restore(User $user, Spray $spray): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Spray $spray): bool
    {
        return false;
    }
}
