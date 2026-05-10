<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please login to access this resource.',
                ], 401);
            }
            abort(403, 'Unauthorized action.');
        }

        foreach ($roles as $role) {
            if ($request->user()->hasRole($role)) {
                return $next($request);
            }
        }

        // Return JSON for API requests
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. You must have one of the following roles: '.implode(', ', $roles),
                'required_roles' => $roles,
            ], 403);
        }

        abort(403, 'Unauthorized action. You do not have the required role.');
    }
}
