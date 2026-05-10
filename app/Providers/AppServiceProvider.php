<?php

namespace App\Providers;

use App\Models\Farm;
use App\Models\Plant;
use App\Models\Spray;
use App\Models\User;
use App\Models\Weather;
use App\Policies\FarmPolicy;
use App\Policies\PlantPolicy;
use App\Policies\RolePolicy;
use App\Policies\SprayPolicy;
use App\Policies\UserPolicy;
use App\Policies\WeatherPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Farm::class => FarmPolicy::class,
        Plant::class => PlantPolicy::class,
        Spray::class => SprayPolicy::class,
        Weather::class => WeatherPolicy::class,
        User::class => UserPolicy::class,
        Role::class => RolePolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }

        // Define gate for admin check (used in some places)
        Gate::define('isAdmin', function (User $user) {
            return $user->hasRole('admin');
        });

        Gate::define('isFarmer', function (User $user) {
            return $user->hasRole('farmer');
        });

        // Super admin gate - bypass all policy checks for admin users
        Gate::before(function (User $user, string $ability) {
            if ($user->hasRole('admin')) {
                return true;
            }
        });

    }
}
