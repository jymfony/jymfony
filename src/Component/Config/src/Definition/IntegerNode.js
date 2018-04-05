const InvalidTypeException = Jymfony.Component.Config.Definition.Exception.InvalidTypeException;
const NumericNode = Jymfony.Component.Config.Definition.NumericNode;

/**
 * This node represents an integer value in the config tree.
 *
 * @memberOf Jymfony.Component.Config.Definition
 */
class IntegerNode extends NumericNode {
    /**
     * @inheritDoc
     */
    validateType(value) {
        if (! isNumber(value) || ~~value !== value) {
            const ex = new InvalidTypeException(__jymfony.sprintf(
                'Invalid type for path "%s". Expected int, but got %s.', this.getPath(), typeof value
            ));

            const hint = this.getInfo();
            if (hint) {
                ex.addHint(hint);
            }

            ex.setPath(this.getPath());
            throw ex;
        }
    }
}

module.exports = IntegerNode;
