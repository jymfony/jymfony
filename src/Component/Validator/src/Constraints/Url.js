const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Url extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (__self.INVALID_URL_ERROR === errorCode) {
            return 'INVALID_URL_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value is not a valid URL.';
        this.protocols = [ 'http', 'https' ];
        this.relativeProtocol = false;
        this.normalizer = undefined;

        const ret = super.__construct(options);
        if (undefined !== this.normalizer && ! isFunction(this.normalizer)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "normalizer" option must be a valid callable ("%s" given).', __jymfony.get_debug_type(this.normalizer)));
        }

        return ret;
    }
}

Object.defineProperty(Url, 'INVALID_URL_ERROR', { writable: false, value: '57c2f299-1154-4870-89bb-ef3b1f5ad229' });
