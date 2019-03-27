declare namespace Jymfony.Component.DevServer {
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;

    /**
     * Development server.
     */
    export class DevServer {
        private _projectDir: string;
        private _logger: LoggerInterface;
        private _fs: any;
        private _argv: string[];
        private _process?: any;
        private _watcher?: any;

        /**
         * Constructor.
         */
        __construct(projectDir: string, logger?: LoggerInterface, fs?: any): void;

        /**
         * Runs the dev server, watching the files and re-starting the process on changes.
         */
        run(argv?: string[]): Promise<void>;

        /**
         * Closes the subprocess and the filesystem watcher.
         */
        close(): void;

        private _restart(): void;
    }
}
