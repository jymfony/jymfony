declare namespace Jymfony.Component.Testing.Argument.Token {
    export class TypeToken extends implementationOf(TokenInterface) {
        private _type: Newable;

        /**
         * Constructor.
         */
        __construct(type: Newable): void;
        constructor(type: Newable);

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
