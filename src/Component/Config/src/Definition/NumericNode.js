const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;
const ScalarNode = Jymfony.Component.Config.Definition.ScalarNode;

/**
 * This node represents a numeric value in the config tree.
 *
 * @memberOf Jymfony.Component.Config.Definition
 */
class NumericNode extends ScalarNode {
    /**
     * Constructor
     *
     * @param {string} name
     * @param {Jymfony.Component.Config.Definition.NodeInterface} parent
     * @param {number} min
     * @param {number} max
     */
    __construct(name, parent = undefined, min = undefined, max = undefined) {
        super.__construct(name, parent);

        /**
         * @type {number}
         * @protected
         */
        this._min = min;

        /**
         * @type {number}
         * @protected
         */
        this._max = max;
    }

    /**
     * @inheritDoc
     */
    finalizeValue(value) {
        value = super.finalizeValue(value);

        let errorMsg;
        if (undefined !== this._min && value < this._min) {
            errorMsg = __jymfony.sprintf('The value %s is too small for path "%s". Should be greater than or equal to %s', value, this.getPath(), this._min);
        }
        if (undefined !== this._max && value > this._max) {
            errorMsg = __jymfony.sprintf('The value %s is too big for path "%s". Should be less than or equal to %s', value, this.getPath(), this._max);
        }

        if (errorMsg) {
            const ex = new InvalidConfigurationException(errorMsg);
            ex.setPath(this.getPath());
            throw ex;
        }

        return value;
    }

    /**
     * @inheritdoc
     */
    isValueEmpty(/* value */) {
        // A numeric value cannot be empty
        return false;
    }
}

module.exports = NumericNode;
