import { usePage } from '@inertiajs/react';

interface Auth {
    roles: string[];
    permissions: string[];
}

export function useAuth() {
    const { auth } = usePage<{ auth: Auth }>().props;

    const hasRole = (role: string | string[]): boolean => {
        if (!auth.roles) return false;

        if (Array.isArray(role)) {
            return role.some((r) => auth.roles.includes(r));
        }
        return auth.roles.includes(role);
    };

    const hasPermission = (permission: string | string[]): boolean => {
        if (!auth.permissions) return false;

        if (Array.isArray(permission)) {
            return permission.some((p) => auth.permissions.includes(p));
        }
        return auth.permissions.includes(permission);
    };

    const isAdmin = (): boolean => {
        return hasRole('admin');
    };

    const isFarmer = (): boolean => {
        return hasRole('farmer');
    };

    return {
        roles: auth.roles || [],
        permissions: auth.permissions || [],
        hasRole,
        hasPermission,
        isAdmin,
        isFarmer,
    };
}
