declare namespace Jymfony.Component.Config.Definition {
    /**
     * This node represents a Boolean value in the config tree.
     */
    export class BooleanNode extends ScalarNode {
        /**
         * @inheritdoc
         */
        validateType(value: any): void;

        /**
         * @inheritdoc
         */
        isValueEmpty(): boolean;
    }
}
