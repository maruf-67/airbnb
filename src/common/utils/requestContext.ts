import { AsyncLocalStorage } from 'node:async_hooks';

interface RequestContext {
    user?: any;
    ip?: string;
}

const context = new AsyncLocalStorage<RequestContext>();

export const requestContext = {
    run: (store: RequestContext, callback: () => void) => {
        context.run(store, callback);
    },
    get: () => {
        return context.getStore();
    },
};
