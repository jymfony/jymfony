declare namespace Jymfony.Contracts.HttpServer {
    interface ListenOptions {
        port?: number;
        host?: string;
        path?: string;
    }

    export class HttpServerInterface {
        public static readonly definition: Newable<HttpServerInterface>;

        /**
         * Listen and handle connections.
         */
        listen(opts?: ListenOptions): Promise<void>;

        /**
         * Closes the server.
         */
        close(): Promise<void>;
    }
}
