declare namespace Jymfony.Component.DependencyInjection.Argument {
    export class RewindableGenerator implements Iterable<any> {
        /**
         * The length of the generator.
         */
        public readonly length: number;

        private _generator: GeneratorFunction;
        private _count: number|Invokable<number>;

        /**
         * Constructor.
         *
         * @param {GeneratorFunction} generator
         * @param {int|Function} count
         */
        __construct(generator: GeneratorFunction, count: number|Invokable<number>): void;
        constructor(generator: GeneratorFunction, count: number|Invokable<number>);

        /**
         * Iterate through values.
         */
        [Symbol.iterator](): Iterator<any>;
    }
}
