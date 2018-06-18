const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;

/**
 * Holds read-only parameters.
 *
 * @memberOf Jymfony.Component.DependencyInjection.ParameterBag
 */
class FrozenParameterBag extends ParameterBag {
    /**
     * Constructor.
     *
     * @param {Map} params
     */
    __construct(params) {
        /**
         * @type {Object}
         *
         * @private
         */
        this._env = {};

        /**
         * @type {Map}
         *
         * @private
         */
        this._params = params;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._resolved = true;
    }

    /**
     * @inheritdoc
     */
    clear() {
        throw new LogicException('Impossible to call clear() on a frozen bag');
    }

    /**
     * @inheritdoc
     */
    add(/* params, overwrite = true */) {
        throw new LogicException('Impossible to call add() on a frozen bag');
    }

    /**
     * @inheritdoc
     */
    set(/* name, value */) {
        throw new LogicException('Impossible to call set() on a frozen bag');
    }

    /**
     * @inheritdoc
     */
    remove(/* name */) {
        throw new LogicException('Impossible to call remove() on a frozen bag');
    }
}

module.exports = FrozenParameterBag;
