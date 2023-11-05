const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Hostname extends Constraint {
    message = 'This value is not a valid hostname.';
    requireTld = true;

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (Hostname.INVALID_HOSTNAME_ERROR === errorCode) {
            return 'INVALID_HOSTNAME_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperty(Hostname, 'INVALID_HOSTNAME_ERROR', { value: '7057ffdb-0af4-4f7e-bd5e-e9acfa6d7a2d', writable: false });
