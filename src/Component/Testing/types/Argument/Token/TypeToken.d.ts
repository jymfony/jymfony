declare namespace Jymfony.Component.Testing.Argument.Token {
    export class TypeToken extends implementationOf(TokenInterface) {
        private _type: Constructor<any>;

        /**
         * Constructor.
         */
        __construct(type: Constructor<any>): void;
        constructor(type: Constructor<any>);

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
