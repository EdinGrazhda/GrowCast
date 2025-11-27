<?php

namespace App\Policies;

use App\Models\Plant;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PlantPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $this->hasPermission($user, 'plant_View');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Plant $plant): bool
    {
        // Admin can view all, others can only view their own
        return $user->hasRole('admin') || 
               ($this->hasPermission($user, 'plant_View') && $plant->user_id === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $this->hasPermission($user, 'plant_Create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Plant $plant): bool
    {
        // Admin can update all, others can only update their own
        return $user->hasRole('admin') || 
               ($this->hasPermission($user, 'plant_Edit') && $plant->user_id === $user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Plant $plant): bool
    {
        // Admin can delete all, others can only delete their own
        return $user->hasRole('admin') || 
               ($this->hasPermission($user, 'plant_Delete') && $plant->user_id === $user->id);
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
    public function restore(User $user, Plant $plant): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Plant $plant): bool
    {
        return false;
    }
}
