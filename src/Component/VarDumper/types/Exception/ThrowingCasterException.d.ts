declare namespace Jymfony.Component.VarDumper.Exception {
    export class ThrowingCasterException extends global.Exception {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(previous?: Error): void;
        constructor(previous?: Error);
    }
}
