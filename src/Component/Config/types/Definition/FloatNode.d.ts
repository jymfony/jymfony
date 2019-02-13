declare namespace Jymfony.Component.Config.Definition {
    /**
     * This node represents an float value in the config tree.
     */
    export class FloatNode extends NumericNode {
        /**
         * @inheritdoc
         */
        validateType(value: any): void;
    }
}
