declare namespace __jymfony {
    import ConsoleCommandEvent = Jymfony.Contracts.Console.Event.ConsoleCommandEvent;
    import FinishRequestEvent = Jymfony.Contracts.HttpServer.Event.FinishRequestEvent;
    import RequestEvent = Jymfony.Contracts.HttpServer.Event.RequestEvent;

    export class ClsTrait {
        public static readonly definition: Newable<ClsTrait>;
        public static readonly COMMAND_SYMBOL: symbol;
        public static readonly REQUEST_SYMBOL: symbol;

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
        private _onHttpRequest(event: RequestEvent): void;

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
