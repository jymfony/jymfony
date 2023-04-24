declare namespace Jymfony.Component.EventDispatcher.Annotation {
    /**
     * Service tag to autoconfigure event listeners.
     */
    export class EventListener {
        private _event: string | Newable;
        private _method: string | null;
        private _priority: number;

        /**
         * Constructor.
         */
        __construct(options: { event: string | Newable, method?: string, priority?: number }): void;
        constructor(options: { event: string | Newable, method?: string, priority?: number });

        public readonly event: string | Newable;

        public readonly method: string | null;

        public readonly priority: number;
    }
}
