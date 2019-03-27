declare namespace Jymfony.Component.Testing.Argument.Token {
    export class TokenInterface implements MixinInterface {
        public static readonly definition: Newable<TokenInterface>;

        /**
         * Calculates token match score for provided argument.
         */
        scoreArgument(argument: any): boolean | number;

        /**
         * Returns true if this token prevents check of other tokens (is last one).
         */
        isLast(): boolean | number;

        /**
         * Returns string representation for token.
         */
        toString(): string;
    }
}
