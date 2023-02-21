declare namespace Jymfony.Component.Messenger {
    import StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

    export class TraceableMessageBus extends implementationOf(MessageBusInterface) {
        private _decoratedBus: MessageBusInterface;
        private _dispatchedMessages: object[];

        /**
         * Constructor.
         */
        __construct(decoratedBus: MessageBusInterface): void;
        constructor(decoratedBus: MessageBusInterface);

        /**
         * @inheritdoc
         */
        dispatch<T extends object>(message: T | Envelope<T>, stamps?: StampInterface[]): Promise<Envelope<T>>;
        public readonly dispatchedMessages: object[];

        reset(): void;

        getCaller(): { name: string, file: string, line: number };
    }
}
