declare namespace Jymfony.Component.DependencyInjection.Argument {
    /**
     * Represents a collection of services found by tag name to lazily iterate over.
     */
    export class TaggedIteratorArgument extends IteratorArgument {
        /**
         * The target tag.
         */
        public readonly tag: string;
        private _tag: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(tag: string): void;
        constructor(tag: string);
    }
}
