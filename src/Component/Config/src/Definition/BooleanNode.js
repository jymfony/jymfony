const ScalarNode = Jymfony.Component.Config.Definition.ScalarNode;
const InvalidTypeException = Jymfony.Component.Config.Definition.Exception.InvalidTypeException;

/**
 * This node represents a Boolean value in the config tree.
 *
 * @memberOf Jymfony.Component.Config.Definition
 */
export default class BooleanNode extends ScalarNode {
    /**
     * @inheritdoc
     */
    validateType(value) {
        if (! isBoolean(value)) {
            const ex = new InvalidTypeException(__jymfony.sprintf('Invalid type for path "%s". Expected boolean, but got %s.', this.getPath(), typeof value));
            const hint = this.getInfo();
            if (hint) {
                ex.addHint(hint);
            }

            ex.setPath(this.getPath());
            throw ex;
        }
    }

    /**
     * @inheritdoc
     */
    isValueEmpty() {
        // A boolean value cannot be empty
        return false;
    }
}
