declare namespace Jymfony.Component.EventDispatcher {
    export class Event {
        private _propagationStopped: boolean;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        isPropagationStopped(): boolean;

        stopPropagation(): void;
    }
}
