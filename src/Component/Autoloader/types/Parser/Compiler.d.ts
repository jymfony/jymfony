declare namespace Jymfony.Component.Autoloader.Parser {
    export class Compiler {
        readonly code: string;

        /**
         * Constructor.
         */
        constructor(code: string);

        private _process(lexer: Lexer): IterableIterator<any>;
        private _processClass(lexer: Lexer, classDocblock: string | undefined): string;
        private _parse(): void;
    }
}
