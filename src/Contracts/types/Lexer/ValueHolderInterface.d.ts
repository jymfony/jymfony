declare namespace Jymfony.Contracts.Lexer {
    /**
     * Value holder interface for lexer.
     */
    export class ValueHolderInterface {
        public static readonly definition: Newable<ValueHolderInterface>;

        /**
         * Gets the value stored in this holder.
         */
        public /* readonly */ value: any;
    }
}
