const CardScheme = Jymfony.Component.Validator.Constraints.CardScheme;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * Validates that a card number belongs to a specified scheme.
 *
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class CardSchemeValidator extends ConstraintValidator {
    __construct() {
        /**
         * @type {Object.<string, RegExp[]>}
         *
         * @protected
         */
        this._schemes = {
            // American Express card numbers start with 34 or 37 and have 15 digits.
            AMEX: [
                /^3[47][0-9]{13}$/,
            ],
            // China UnionPay cards start with 62 and have between 16 and 19 digits.
            // Please note that these cards do not follow Luhn Algorithm as a checksum.
            CHINA_UNIONPAY: [
                /^62[0-9]{14,17}$/,
            ],
            // Diners Club card numbers begin with 300 through 305, 36 or 38. All have 14 digits.
            // There are Diners Club cards that begin with 5 and have 16 digits.
            // These are a joint venture between Diners Club and MasterCard, and should be processed like a MasterCard.
            DINERS: [
                /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            ],
            // Discover card numbers begin with 6011, 622126 through 622925, 644 through 649 or 65.
            // All have 16 digits.
            DISCOVER: [
                /^6011[0-9]{12}$/,
                /^64[4-9][0-9]{13}$/,
                /^65[0-9]{14}$/,
                /^622(12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|91[0-9]|92[0-5])[0-9]{10}$/,
            ],
            // InstaPayment cards begin with 637 through 639 and have 16 digits.
            INSTAPAYMENT: [
                /^63[7-9][0-9]{13}$/,
            ],
            // JCB cards beginning with 2131 or 1800 have 15 digits.
            // JCB cards beginning with 35 have 16 digits.
            JCB: [
                /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
            ],
            // Laser cards begin with either 6304, 6706, 6709 or 6771 and have between 16 and 19 digits.
            LASER: [
                /^(6304|670[69]|6771)[0-9]{12,15}$/,
            ],
            // Maestro international cards begin with 675900..675999 and have between 12 and 19 digits.
            // Maestro UK cards begin with either 500000..509999 or 560000..699999 and have between 12 and 19 digits.
            MAESTRO: [
                /^(6759[0-9]{2})[0-9]{6,13}$/,
                /^(50[0-9]{4})[0-9]{6,13}$/,
                /^5[6-9][0-9]{10,17}$/,
                /^6[0-9]{11,18}$/,
            ],
            // All MasterCard numbers start with the numbers 51 through 55. All have 16 digits.
            // October 2016 MasterCard numbers can also start with 222100 through 272099.
            MASTERCARD: [
                /^5[1-5][0-9]{14}$/,
                /^2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12})$/,
            ],
            // All Visa card numbers start with a 4 and have a length of 13, 16, or 19 digits.
            VISA: [
                /^4([0-9]{12}|[0-9]{15}|[0-9]{18})$/,
            ],
        };

        return super.__construct();
    }

    /**
     * Validates a creditcard belongs to a specified scheme.
     *
     * @param {*} value
     * @param {Jymfony.Component.Validator.Constraints.CardScheme} constraint
     */
    validate(value, constraint) {
        if (! (constraint instanceof CardScheme)) {
            throw new UnexpectedTypeException(constraint, CardScheme);
        }

        if (null === value || '' === value || undefined === value) {
            return;
        }

        if (! isNumeric(value)) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(CardScheme.NOT_NUMERIC_ERROR)
                .addViolation();

            return;
        }

        value = String(value);
        const schemes = isArray(constraint.schemes) ? constraint.schemes : [ constraint.schemes ];

        for (const scheme of schemes) {
            const regexes = this._schemes[scheme] || [];
            for (const regex of regexes) {
                if (value.match(regex)) {
                    return;
                }
            }
        }

        this._context.buildViolation(constraint.message)
            .setParameter('{{ value }}', this._formatValue(value))
            .setCode(CardScheme.INVALID_FORMAT_ERROR)
            .addViolation();
    }
}
