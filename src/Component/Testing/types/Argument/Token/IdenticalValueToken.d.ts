declare namespace Jymfony.Component.Testing.Argument.Token {
    export class IdenticalValueToken extends implementationOf(TokenInterface) {
        private _value: any;

        /**
         * Constructor.
         */
        __construct(value: any): void;
        constructor(value: any);

        /**
         * @inheritdoc
         */
        scoreArgument(argument: any): number | false;

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
