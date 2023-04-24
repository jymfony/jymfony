const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * @memberOf Jymfony.Component.Testing.Constraints
 */
export default class HasKey extends Constraint {
    /**
     * Constructor.
     *
     * @param {*} key
     */
    __construct(key) {
        this._key = key;
    }

    /**
     * @inheritDoc
     */
    toString() {
        return 'has the key ' + this.export(this._key);
    }

    /**
     * @inheritDoc
     */
    matches(other) {
        if (other instanceof Map || other instanceof WeakMap) {
            return other.has(this._key);
        }

        return Reflect.has(other, this._key);
    }

    /**
     * @inheritDoc
     */
    _failureDescription(other) {
        return __jymfony.get_debug_type(other) + ' ' + this.toString();
    }
}
