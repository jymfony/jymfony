declare namespace Jymfony.Component.Messenger.Annotation {
    interface MessageHandlerOptions {
        bus?: string;
        fromTransport?: string;
        handles?: string;
        method?: string;
        priority?: number;
    }

    /**
     * Service tag to autoconfigure message handlers.
     */
    export class MessageHandler {
        /**
         * Constructor.
         */
        __construct(options?: MessageHandlerOptions): void;
        constructor(options?: MessageHandlerOptions);

        public readonly asTag: object;
    }
}
