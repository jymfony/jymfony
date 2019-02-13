declare namespace Jymfony.Component.Config.Definition.Builder {
    /**
     * Abstract class that contains common code of integer and float node definitions.
     *
     * @memberOf Jymfony.Component.Config.Definition.Builder
     *
     * @abstract
     */
    export abstract class NumericNodeDefinition<T extends NodeDefinition = any> extends ScalarNodeDefinition<T> {
        protected _min?: number;
        protected _max?: number;

        /**
         * Constructor.
         */
        __construct(name: string, parent?: T): void;
        constructor(name: string, parent?: T);

        /**
         * Ensures that the value is smaller than the given reference.
         *
         * @throws {InvalidArgumentException} when the constraint is inconsistent
         */
        max(max: number | undefined): this;

        /**
         * Ensures that the value is bigger than the given reference.
         *
         * @throws {InvalidArgumentException} when the constraint is inconsistent
         */
        min(min: number | undefined): this;

        /**
         * @inheritdoc
         *
         * @throws {Jymfony.Component.Config.Definition.Exception.InvalidDefinitionException}
         */
        cannotBeEmpty(): this;
    }
}
