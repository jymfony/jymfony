declare namespace Jymfony.Component.Testing.Argument.Token {
    export class AnyValueToken extends implementationOf(TokenInterface) {
        /**
         * @inheritdoc
         */
        scoreArgument(): number;

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
