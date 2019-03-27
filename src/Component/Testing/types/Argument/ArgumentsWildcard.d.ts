declare namespace Jymfony.Component.Testing.Argument {
    export class ArgumentsWildcard {
        private _tokens: Token.TokenInterface[];
        private _string: string;

        /**
         * Constructor.
         */
        __construct(args: any[]): void;
        constructor(args: any[]);

        scoreArguments(args: any[]): number | boolean;

        toString(): string;
    }
}
