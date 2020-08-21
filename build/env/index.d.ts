import { createBrowserEnv } from './createBrowserEnv';
import { createFileSystem } from './createFileSystem';
import { createNodejsEnv } from './createNodejsEnv';
import { isBrowser } from './isBrowser';
import { isNodejs } from './isNodejs';
import { Environment } from './types';
declare function getEnv(): Environment;
declare function setEnv(env: Environment): void;
declare function initialize(): void;
declare function monkeyPatch(env: Partial<Environment>): void;
export declare const env: {
    getEnv: typeof getEnv;
    setEnv: typeof setEnv;
    initialize: typeof initialize;
    createBrowserEnv: typeof createBrowserEnv;
    createFileSystem: typeof createFileSystem;
    createNodejsEnv: typeof createNodejsEnv;
    monkeyPatch: typeof monkeyPatch;
    isBrowser: typeof isBrowser;
    isNodejs: typeof isNodejs;
};
export * from './types';
//# sourceMappingURL=index.d.ts.map