declare namespace Jymfony.Component.Console.Exception {
    export class CommandNotFoundException extends InvalidArgumentException {
        public alternatives: string[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, alternatives: string[], previous?: Error): void;
        constructor(message: string, alternatives: string[], previous?: Error);
    }
}
