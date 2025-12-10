/**
 * System Permissions
 * 
 * Defined as a fixed list as per business logic.
 * These govern access to the Admin Panel and specific features.
 */

export const PERMISSIONS = {
    // Dashboard
    DASHBOARD_VIEW: 'dashboard.view',

    // Role Management
    ROLE_READ: 'role.read',
    ROLE_CREATE: 'role.create',
    ROLE_UPDATE: 'role.update',
    ROLE_DELETE: 'role.delete',

    // User Management
    USER_READ: 'user.read',
    USER_CREATE: 'user.create',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',

    // Content Management (Example)
    CONTENT_READ: 'content.read',
    CONTENT_CREATE: 'content.create',
    CONTENT_UPDATE: 'content.update',
    CONTENT_DELETE: 'content.delete',

    // Settings
    SETTINGS_VIEW: 'settings.view',
    SETTINGS_UPDATE: 'settings.update',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Group permissions for easier assignment in Seeders
export const PERMISSION_GROUPS = {
    SUPER_ADMIN: Object.values(PERMISSIONS),

    // Admin has everything EXCEPT Role Management
    ADMIN: Object.values(PERMISSIONS).filter(p => !p.startsWith('role.')),

    USER: [] as Permission[]
};
