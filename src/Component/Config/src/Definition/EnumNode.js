const ScalarNode = Jymfony.Component.Config.Definition.ScalarNode;
const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;

/**
 * Node which only allows a finite set of values.
 *
 * @memberOf Jymfony.Component.Config.Definition
 */
class EnumNode extends ScalarNode {
    __construct(name, parent = undefined, values = []) {
        values = [ ...new Set(values) ];
        if (0 === values.length) {
            throw new InvalidArgumentException('values must contain at least one element.');
        }

        super.__construct(name, parent);

        /**
         * @type {Array}
         * @private
         */
        this._values = values;
    }

    getValues() {
        return this._values;
    }

    finalizeValue(value) {
        value = super.finalizeValue(value);

        if (-1 === this._values.indexOf(value)) {
            const ex = new InvalidConfigurationException(__jymfony.sprintf(
                'The value %s is not allowed for path "%s". Permissible values: %s',
                JSON.stringify(value),
                this.getPath(),
                this._values.map(v => JSON.stringify(v)).join(', ')));
            ex.setPath(this.getPath());

            throw ex;
        }

        return value;
    }
}

module.exports = EnumNode;
