const VariableNode = Jymfony.Component.Config.Definition.VariableNode;
const InvalidTypeException = Jymfony.Component.Config.Definition.Exception.InvalidTypeException;

/**
 * @memberOf Jymfony.Component.Config.Definition
 */
export default class ScalarNode extends VariableNode {
    /**
     * @inheritdoc
     */
    validateType(value) {
        if (! isScalar(value) && undefined !== value && null !== value) {
            const ex = new InvalidTypeException(__jymfony.sprintf(
                'Invalid type for path "%s". Expected scalar, but got %s.',
                this.getPath(),
                typeof value
            ));

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
    isValueEmpty(value) {
        return undefined === value || null === value || '' === value;
    }
}
