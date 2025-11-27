<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use AuthorizesRequests;

    /**
     * Check if user is admin.
     */
    private function checkGate()
    {
        if (!Gate::allows('isAdmin')) {
            abort(403);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->checkGate();
        
        $users = User::with('roles')->latest()->get();
        
        return Inertia::render('Admin/Users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->checkGate();
        
        $roles = Role::all();
        
        return Inertia::render('Admin/Users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->checkGate();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (isset($validated['role'])) {
            $user->assignRole($validated['role']);
        }

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->checkGate();
        
        $user->load('roles.permissions');
        
        return Inertia::render('Admin/Users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $this->checkGate();
        
        $user->load('roles');
        $roles = Role::all();
        
        return Inertia::render('Admin/Users/edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->checkGate();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);
        }

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->checkGate();
        
        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Show the role assignment page for a user.
     */
    public function assignRolePage(User $user)
    {
        $this->checkGate();
        
        $user->load('roles');
        $roles = Role::all();
        
        return Inertia::render('Admin/Users/assignRole', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Assign a role to a user.
     */
    public function assignRole(Request $request, User $user)
    {
        $this->checkGate();
        
        $validated = $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')
            ->with('success', 'Role assigned successfully.');
    }

    /**
     * Remove a role from a user.
     */
    public function removeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user->removeRole($validated['role']);

        return redirect()->route('users.index')
            ->with('success', 'Role removed successfully.');
    }

    /**
     * Sync roles for a user (replace all roles).
     */
    public function syncRoles(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('users.index')
            ->with('success', 'Roles synced successfully.');
    }
}
