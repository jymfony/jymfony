declare namespace Jymfony.Component.HttpServer.Exception {
    export class UnhandledRejectionException extends global.Exception {
        // @ts-ignore
        __construct(previous: Error): void;
        constructor(previous: Error);
    }
}
