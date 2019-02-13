declare namespace Jymfony.Component.Config.Definition.Builder {
    /**
     * This class builds an if expression.
     */
    export class ExprBuilder<T extends NodeDefinition = any> {
        public ifPart?: Invokable;
        public thenPart?: Invokable;
        protected _node: T;

        /**
         * Constructor.
         */
        __construct(node: T): void;
        constructor(node: T);

        /**
         * Marks the expression as being always used.
         */
        always(then?: Invokable): this;

        /**
         * Sets a closure to use as tests.
         *
         * The default one tests if the value is true.
         */
        ifTrue(closure?: Invokable): this;

        /**
         * Tests if the value is a string.
         */
        ifString(): this;

        /**
         * Tests if the value is null.
         */
        ifNull(): this;

        /**
         * Tests if the value is empty.
         */
        ifEmpty(): this;

        /**
         * Tests if the value is an array.
         */
        ifArray(): this;

        /**
         * Tests if the value is in an array.
         */
        ifInArray(array: any[]): this;

        /**
         * Tests if the value is not in an array.
         */
        ifNotInArray(array: any[]): this;

        /**
         * Transforms variables of any type into an array.
         */
        castToArray(): this;

        /**
         * Sets the closure to run if the test pass.
         */
        then(closure: Invokable): this;

        /**
         * Sets a closure returning an empty array.
         */
        thenEmptyArray(): this;

        /**
         * Sets a closure returning an empty object.
         */
        thenEmptyObject(): this;

        /**
         * Sets a closure marking the value as invalid at validation time.
         * If you want to add the value of the node in your message just use a %s placeholder.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException}
         */
        thenInvalid(message: string): this;

        /**
         * Sets a closure unsetting this key of the array at validation time.
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.UnsetKeyException}
         */
        thenUnset(): this;

        /**
         * Returns the related node.
         *
         * @throws {RuntimeException}
         */
        end(): T;

        /**
         * Builds the expressions.
         */
        static buildExpressions(expressions: ExprBuilder[]): Invokable[];
    }
}
