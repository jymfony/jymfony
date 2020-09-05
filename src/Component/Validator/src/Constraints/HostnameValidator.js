const Hostname = Jymfony.Component.Validator.Constraints.Hostname;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

const RFC_1123_REGEX = /^(?:\b(?![0-9]+$)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.?\b)+$/g;
const RESERVED_TLDS = [
    'example',
    'invalid',
    'localhost',
    'test',
];

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class HostnameValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Hostname)) {
            throw new UnexpectedTypeException(constraint, Hostname);
        }

        if ('' === value || null === value || undefined === value) {
            return;
        }

        if (! isScalar(value)) {
            value = String(value);
        }

        if ('' === value) {
            return;
        }

        if (! this._isValid(value) || (constraint.requireTld && ! this._hasValidTld(value))) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Hostname.INVALID_HOSTNAME_ERROR)
                .addViolation();
        }
    }

    /**
     * Checks if the hostname is valid.
     *
     * @param {string} domain
     *
     * @returns {boolean}
     *
     * @private
     */
    _isValid(domain) {
        return null !== String(domain).match(RFC_1123_REGEX);
    }

    /**
     * Checks if tld is valid (and not reserved)
     *
     * @param {string} domain
     *
     * @returns {boolean}
     *
     * @private
     */
    _hasValidTld(domain) {
        domain = String(domain);

        return -1 !== domain.indexOf('.') && ! RESERVED_TLDS.includes(domain.substr(domain.lastIndexOf('.') + 1));
    }
}
