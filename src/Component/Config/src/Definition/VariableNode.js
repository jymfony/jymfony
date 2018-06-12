const BaseNode = Jymfony.Component.Config.Definition.BaseNode;
const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;

/**
 * @memberOf Jymfony.Component.Config.Definition
 */
class VariableNode extends BaseNode {
    /**
     * @inheritdoc
     */
    __construct(name, parent = undefined) {
        super.__construct(name, parent);

        /**
         * @type {boolean}
         * @protected
         */
        this._defaultValueSet = false;

        /**
         * @type {boolean}
         * @protected
         */
        this._allowEmptyValue = true;

        /**
         * @type {*}
         * @protected
         */
        this._defaultValue = undefined;
    }

    /**
     * @inheritdoc
     */
    setDefaultValue(value) {
        this._defaultValueSet = true;
        this._defaultValue = value;
    }

    /**
     * @inheritdoc
     */
    hasDefaultValue() {
        return this._defaultValueSet;
    }

    /**
     * @inheritdoc
     */
    getDefaultValue() {
        const v = this._defaultValue;

        return isFunction(v) ? v() : v;
    }

    /**
     * Sets if this node is allowed to have an empty value.
     *
     * @param {boolean} bool True if this entity will accept empty values
     */
    setAllowEmptyValue(bool) {
        this._allowEmptyValue = !! bool;
    }

    /**
     * @inheritdoc
     */
    setName(name) {
        this._name = name;
    }

    /**
     * @inheritdoc
     */
    validateType() {
    }

    /**
     * @inheritdoc
     */
    finalizeValue(value) {
        if (! this._allowEmptyValue && this.isValueEmpty(value)) {
            const ex = new InvalidConfigurationException(__jymfony.sprintf(
                'The path "%s" cannot contain an empty value, but got %s.',
                this.getPath(),
                JSON.stringify(value)
            ));

            const hint = this.getInfo();
            if (hint) {
                ex.addHint(hint);
            }

            ex.setPath(this.getPath());

            throw ex;
        }

        return value;
    }

    /**
     * @inheritdoc
     */
    normalizeValue(value) {
        return value;
    }

    /**
     * @inheritdoc
     */
    mergeValues(leftSide, rightSide) {
        return rightSide;
    }

    /**
     * Evaluates if the given value is to be treated as empty.
     *
     * By default, boolean cast is used to test for emptiness. This
     * method may be overridden by subtypes to better match their understanding
     * of empty data.
     *
     * @param {*} value
     *
     * @returns {boolean}
     */
    isValueEmpty(value) {
        return ! value;
    }
}

module.exports = VariableNode;
