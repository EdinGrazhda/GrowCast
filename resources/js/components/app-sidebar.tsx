import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    CloudRain,
    Folder,
    LayoutGrid,
    MapPin,
    ShieldCheck,
    Sprout,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const allNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permissions: ['dashboard_View'], // accessible by anyone with dashboard_View permission
    },
    {
        title: 'Farms',
        href: '/farms',
        icon: MapPin,
        permissions: ['farm_View'], // accessible by anyone with farm_View permission
    },
    {
        title: 'Plants',
        href: '/plants',
        icon: Sprout,
        permissions: ['plant_View'], // accessible by anyone with plant_View permission
    },
    {
        title: 'Sprays',
        href: '/sprays',
        icon: Sprout,
        permissions: ['spray_View'], // accessible by anyone with spray_View permission
    },
    {
        title: 'Weather',
        href: '/weather',
        icon: CloudRain,
        permissions: ['weather_View'], // accessible by anyone with weather_View permission
    },
    {
        title: 'Disease Detection',
        href: '/plant-disease',
        icon: Activity,
        permissions: ['plant_View'], // accessible by anyone with plant_View permission
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        permissions: ['user_View'], // accessible by anyone with user_View permission
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: ShieldCheck,
        permissions: ['role_View'], // accessible by anyone with role_View permission
    },
    
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
 
];

export function AppSidebar() {
    const { hasPermission, isAdmin } = useAuth();

    // Filter nav items based on user permissions
    const mainNavItems = allNavItems.filter((item) => {
        // Admins see everything
        if (isAdmin()) {
            return true;
        }

        // If item has no permissions specified, show it to everyone
        if (!item.permissions || item.permissions.length === 0) {
            return true;
        }

        // Check if user has any of the required permissions
        return item.permissions.some((permission) => hasPermission(permission));
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
