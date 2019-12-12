declare namespace Jymfony.Component.Console.Helper {
    /**
     * @internal
     */
    export class TableRows implements Iterable<(string | TableCell)[] | TableSeparator> {
        private _generator: GeneratorFunction;

        /**
         * Constructor.
         */
        __construct(generator: GeneratorFunction): void;

        [Symbol.iterator](): Iterator<(string | TableCell)[] | TableSeparator>;
    }
}
