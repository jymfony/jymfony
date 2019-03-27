declare namespace Jymfony.Component.Config.Definition {
    /**
     * This node represents a numeric value in the config tree.
     */
    export class NumericNode extends ScalarNode {
        protected _min: number;
        protected _max: number;

        /**
         * Constructor.
         */
        __construct(name: string, parent?: NodeInterface, min?: number, max?: number): void;

        /**
         * @inheritdoc
         */
        finalizeValue(value: any): any;

        /**
         * @inheritdoc
         */
        isValueEmpty(value: any): boolean;
    }
}
