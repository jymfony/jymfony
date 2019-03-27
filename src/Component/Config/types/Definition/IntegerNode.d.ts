declare namespace Jymfony.Component.Config.Definition {
    /**
     * This node represents an integer value in the config tree.
     */
    export class IntegerNode extends NumericNode {
        /**
         * @inheritdoc
         */
        validateType(value: any): void;
    }
}
