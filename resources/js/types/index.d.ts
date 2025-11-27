import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    roles: string[];
    permissions: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles?: string[];
    permissions?: string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Plant {
    id: number;
    name: string;
    stock: number;
    info?: string;
    created_at: string;
    updated_at: string;
}

export interface Farm {
    id: number;
    name: string;
    description?: string;
    latitude: string | number;
    longitute: string | number;
    user_id: number;
    plant_id: number;
    user?: User;
    plant?: Plant;
    created_at: string;
    updated_at: string;
}

export interface Weather {
    id: number;
    temperature: number;
    humidity: number;
    air_pressure: number;
    wind_speed: number;
    plant_id: number;
    farm_id?: number;
    status: string;
    recommendation?: string;
    best_planting_day?: string;
    plant?: Plant;
    farm?: Farm;
    created_at: string;
    updated_at: string;
}
