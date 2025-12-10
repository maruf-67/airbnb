import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Middleware to check if user has required permissions.
 * Matches Laravel's 'hasAnyPermission' logic: Passes if user has AT LEAST ONE of the required permissions.
 * 
 * Usage: router.get('/', checkPermission('user.read', 'user.create'), controller.index);
 */
export const checkPermission = (...requiredPermissions) => {
    return (req, res, next) => {
        // 1. Ensure user is authenticated (authMiddleware should run first)
        if (!req.user) {
            return next(new AppError('Unauthorized - Please log in', 401));
        }

        // 2. Get user permissions
        // Note: User model should populate 'role' which has 'permissions' array
        // Fallback to empty array if structure is different
        let userPermissions = [];
        
        if (req.user.role && Array.isArray(req.user.role.permissions)) {
            userPermissions = req.user.role.permissions;
        } else if (req.user.permissions && Array.isArray(req.user.permissions)) {
            // In case permissions are flattened onto user
            userPermissions = req.user.permissions;
        }

        // 3. Admin Override (Optional: Matches typical setups where Admin has all access)
        if (req.user.role && req.user.role.name === 'admin') {
            return next();
        }

        // 4. Check for intersection
        const hasPermission = userPermissions.some(permission => 
            requiredPermissions.includes(permission)
        );

        if (!hasPermission) {
            return next(new AppError('Forbidden - Insufficient permissions', 403));
        }

        next();
    };
};
