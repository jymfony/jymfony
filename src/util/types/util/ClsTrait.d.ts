declare namespace __jymfony {
    import ConsoleCommandEvent = Jymfony.Component.Console.Event.ConsoleCommandEvent;
    import GetResponseEvent = Jymfony.Component.HttpServer.Event.GetResponseEvent;
    import FinishRequestEvent = Jymfony.Component.HttpServer.Event.FinishRequestEvent;

    export class ClsTrait implements MixinInterface {
        public static readonly definition: Newable<ClsTrait>;

        private _currentUid: number;
        private _activeContext: any;
        private _contextSet: any[];
        private _consoleContext?: any;
        private _requestContexts: Map<any, any>;
        private _contexts: Map<number, any>;

        /**
         * Called on console command init.
         */
        private _onConsoleCommand(event: ConsoleCommandEvent): void;

        /**
         * Console command terminate (called on console exit).
         */
        private _onConsoleTerminate(): void;

        /**
         * Called on http server request init.
         */
        private _onHttpRequest(event: GetResponseEvent): void;

        /**
         * Called on http server request finish.
         */
        private _onHttpFinishRequest(event: FinishRequestEvent): void;

        /**
         * Initialize async hooks to have request/command context.
         */
        private _initAsyncHooks(): void;
    }
}
