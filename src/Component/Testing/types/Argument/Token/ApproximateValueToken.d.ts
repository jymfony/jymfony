declare namespace Jymfony.Component.Testing.Argument.Token {
    export class ApproximateValueToken extends implementationOf(TokenInterface) {
        private _value: number;
        private _precision: number;

        /**
         * Constructor.
         */
        __construct(value: number, precision?: number): void;
        constructor(value: number, precision?: number);

        /**
         * @inheritdoc
         */
        scoreArgument(argument: any): number | boolean;

        /**
         * @inheritdoc
         */
        isLast(): boolean;

        /**
         * @inheritdoc
         */
        toString(): string;
    }
}
