declare namespace Jymfony.Component.Testing.Argument.Token {
    export class CallbackToken extends implementationOf(TokenInterface) {
        private _callback: Invokable<boolean>;

        /**
         * Constructor.
         */
        __construct(callback: Invokable<boolean>): void;
        constructor(callback: Invokable<boolean>);

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
