import path from 'path';
import {
    fileURLToPath
} from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves a path relative to the project root directory.
 * @param {...string} paths - Path segments to resolve.
 * @returns {string} The resolved absolute path.
 */
export const resolveFromRoot = (...paths) => {
    return path.resolve(__dirname, '../../', ...paths);
};

/**
 * Gets the absolute path to the src directory.
 * @param {...string} paths - Additional path segments.
 * @returns {string} The resolved path.
 */
export const getSrcPath = (...paths) => {
    return resolveFromRoot('src', ...paths);
};

/**
 * Gets the absolute path to the views directory.
 * @param {...string} paths - Additional path segments.
 * @returns {string} The resolved path.
 */
export const getViewsPath = (...paths) => {
    return getSrcPath('views', ...paths);
};

/**
 * Gets the absolute path to the assets directory.
 * @param {...string} paths - Additional path segments.
 * @returns {string} The resolved path.
 */
export const getAssetsPath = (...paths) => {
    return getSrcPath('assets', ...paths);
};