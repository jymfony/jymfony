const Constraint = Jymfony.Component.Validator.Constraint;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Ip extends Constraint {
    message = 'This value is not a valid hostname.';
    version = __self.V4;
    normalizer = null;

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (Ip.INVALID_IP_ERROR === errorCode) {
            return 'INVALID_IP_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        const ret = super.__construct(options);
        if (! __self._versions.includes(this.version)) {
            throw new ConstraintDefinitionException(__jymfony.sprintf('The option "version" must be one of "%s".', __self._versions.join('", "')));
        }

        if (null !== this.normalizer && ! isFunction(this.normalizer)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "normalizer" option must be a valid callable ("%s" given).', __jymfony.get_debug_type(this.normalizer)));
        }

        return ret;
    }

    /**
     * @type {string[]}
     * @protected
     */
    static get _versions() {
        return [
            Ip.V4,
            Ip.V6,
            Ip.ALL,

            Ip.V4_NO_PRIV,
            Ip.V6_NO_PRIV,
            Ip.ALL_NO_PRIV,

            Ip.V4_NO_RES,
            Ip.V6_NO_RES,
            Ip.ALL_NO_RES,

            Ip.V4_ONLY_PUBLIC,
            Ip.V6_ONLY_PUBLIC,
            Ip.ALL_ONLY_PUBLIC,
        ];
    }
}

Object.defineProperties(Ip, {
    INVALID_IP_ERROR: { value: 'b1b427ae-9f6f-41b0-aa9b-84511fbb3c5b', writable: false },

    V4: { value: '4', writable: false },
    V6: { value: '6', writable: false },
    ALL: { value: 'all', writable: false },

    // Skip private ranges
    V4_NO_PRIV: { value: '4_no_priv', writable: false },
    V6_NO_PRIV: { value: '6_no_priv', writable: false },
    ALL_NO_PRIV: { value: 'all_no_priv', writable: false },

    // Skip reserved ranges
    V4_NO_RES: { value: '4_no_res', writable: false },
    V6_NO_RES: { value: '6_no_res', writable: false },
    ALL_NO_RES: { value: 'all_no_res', writable: false },

    // Skip both
    V4_ONLY_PUBLIC: { value: '4_public', writable: false },
    V6_ONLY_PUBLIC: { value: '6_public', writable: false },
    ALL_ONLY_PUBLIC: { value: 'all_public', writable: false },
});
