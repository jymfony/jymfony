const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Url = Jymfony.Component.Validator.Constraints.Url;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class UrlValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Url)) {
            throw new UnexpectedTypeException(constraint, Url);
        }

        if (undefined === value || null === value || '' === value) {
            return;
        }

        const originalValue = value = String(value);
        if ('' === value) {
            return;
        }

        if (undefined !== constraint.normalizer) {
            value = (constraint.normalizer)(value);
        }

        let valid;
        try {
            let url;
            if (constraint.relativeProtocol && value.startsWith('//') && '//' !== value) {
                value = 'relative:' + value;
                url = new URL(value);
                valid = 'relative:' === url.protocol;
            } else {
                url = new URL(value);
                valid = constraint.protocols.includes(url.protocol.replace(/:$/, ''));
            }

            valid = valid && value.startsWith(url.protocol + '//');
        } catch (e) {
            valid = false;
        }

        if (! valid) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(originalValue))
                .setCode(Url.INVALID_URL_ERROR)
                .addViolation();
        }
    }
}
