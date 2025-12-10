// -----------------------------
// Core Node.js path utilities
// -----------------------------
import path, {
    dirname
} from 'path';

// Utility to convert `import.meta.url` to actual filesystem path
import {
    fileURLToPath
} from 'url';


// Get current directory of THIS file (utils folder)
// @ts-ignore - import.meta is meta-property
const __dirname = dirname(fileURLToPath(import.meta.url));

// Navigate from common/utils -> common -> src -> project root
const rootDir = path.resolve(__dirname, '..', '..', '..'); // cached once


/**
 * Resolves a path relative to the project root directory.
 * Example: resolveFromRoot('src', 'views')
 */
export const resolveFromRoot = (...paths: string[]) =>
    path.resolve(rootDir, ...paths);


/**
 * Get absolute path to `/src` directory
 * Example: getSrcPath('views') → /project/src/views
 */
export const getSrcPath = (...paths: string[]) => {
    return resolveFromRoot('src', ...paths);
};


/**
 * Get absolute path to `/src/views`
 * Example: getViewsPath('home.ejs') → /project/src/views/home.ejs
 */
export const getViewsPath = (...paths: string[]) => {
    return getSrcPath('views', ...paths);
};


/**
 * Get absolute path to `/src/assets`
 * Example: getAssetsPath('css')
 */
export const getAssetsPath = (...paths: string[]) => {
    return getSrcPath('assets', ...paths);
};
