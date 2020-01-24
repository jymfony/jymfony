declare namespace Jymfony.Component.HttpFoundation.Session.Storage {
    /**
     * In memory storage backend for session.
     */
    export class MockArraySessionStorage extends CacheSessionStorage {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(lifetime?: number): void;
        constructor(lifetime?: number);
    }
}
