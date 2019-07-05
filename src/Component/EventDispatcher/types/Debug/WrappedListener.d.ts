declare namespace Jymfony.Component.EventDispatcher.Debug {
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;

    export class WrappedListener<T extends Invokable<any> = () => any> {
        public readonly wrappedListener: T;

        public readonly wasCalled: boolean;

        public readonly stoppedPropagation: boolean;

        public readonly pretty: string;

        private _listener: T;

        private _dispacther: EventDispatcherInterface;

        private _called: boolean;

        private _stoppedPropagation: boolean;

        private _name: string;

        private _pretty: string;

        /**
         * Constructor.
         */
        __construct(listener: Invokable<any>, dispatcher: EventDispatcherInterface): WrappedListener & T;
        constructor(listener: Invokable<any>, dispatcher: EventDispatcherInterface);
    }
}
