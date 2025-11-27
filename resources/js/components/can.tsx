import { useAuth } from '@/hooks/use-auth';
import { ReactNode } from 'react';

interface CanProps {
    role?: string | string[];
    permission?: string | string[];
    children: ReactNode;
    fallback?: ReactNode;
}

export function Can({ role, permission, children, fallback = null }: CanProps) {
    const { hasRole, hasPermission } = useAuth();

    let authorized = true;

    if (role) {
        authorized = authorized && hasRole(role);
    }

    if (permission) {
        authorized = authorized && hasPermission(permission);
    }

    return <>{authorized ? children : fallback}</>;
}
