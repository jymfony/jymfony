declare namespace Jymfony.Contracts.EventDispatcher {
    export class Event {
        private _propagationStopped: boolean;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        isPropagationStopped(): boolean;

        /**
         * @inheritdoc
         */
        stopPropagation(): void;
    }
}
