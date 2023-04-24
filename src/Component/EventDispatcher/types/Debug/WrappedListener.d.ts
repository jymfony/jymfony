declare namespace Jymfony.Component.EventDispatcher.Debug {
    import EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
    import StopwatchInterface = Jymfony.Contracts.Stopwatch.StopwatchInterface;

    export interface ListenerInfo {
        event: string,
        priority: number | null,
        pretty: string,
    }

    export class WrappedListener<T extends Invokable<any> = () => any> {
        private _listener: T;
        private _dispatcher: EventDispatcherInterface;
        private _called: boolean;
        private _stopwatch: StopwatchInterface;
        private _stoppedPropagation: boolean;
        private _name: string;
        private _pretty: string;
        private _priority: string;

        /**
         * Constructor.
         */
        __construct(listener: Invokable<any>, eventName: string, dispatcher: EventDispatcherInterface): WrappedListener & T;
        constructor(listener: Invokable<any>, eventName: string, dispatcher: EventDispatcherInterface);

        public readonly wrappedListener: T;
        public readonly wasCalled: boolean;
        public readonly stoppedPropagation: boolean;
        public readonly pretty: string;

        __invoke(event: object, eventName: string, dispatcher: EventDispatcherInterface): void;

        getInfo(eventName: string): ListenerInfo;
    }
}
