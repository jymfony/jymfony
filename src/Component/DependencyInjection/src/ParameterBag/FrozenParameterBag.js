const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;

/**
 * Holds read-only parameters
 *
 * @memberOf Jymfony.Component.DependencyInjection.ParameterBag
 */
module.exports = class FrozenParameterBag extends ParameterBag {
    /**
     * @param {Map} params
     */
    __construct(params) {
        this._params = params;
        this._resolved = true;
    }

    /**
     * @inheritDoc
     */
    clear() {
        throw new LogicException('Impossible to call clear() on a frozen bag');
    }

    /**
     * @inheritDoc
     */
    add(/* params, overwrite = true */) {
        throw new LogicException('Impossible to call add() on a frozen bag');
    }

    /**
     * @inheritDoc
     */
    set(/* name, value */) {
        throw new LogicException('Impossible to call set() on a frozen bag');
    }

    /**
     * @inheritDoc
     */
    remove(/* name */) {
        throw new LogicException('Impossible to call remove() on a frozen bag');
    }
};
