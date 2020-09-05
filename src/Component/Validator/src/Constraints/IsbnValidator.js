const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Isbn = Jymfony.Component.Validator.Constraints.Isbn;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsbnValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Isbn)) {
            throw new UnexpectedTypeException(constraint, Isbn);
        }

        if (undefined === value || null === value || '' === value) {
            return;
        }

        value = String(value);
        const canonicalized = value.replace(/-/g, '');

        let code;
        if ('isbn13' !== constraint.type) {
            code = this._validateIsbn10(canonicalized);
        }

        if ('isbn10' !== constraint.type && (code === undefined || code === Isbn.TOO_LONG_ERROR)) {
            const isbn13Code = this._validateIsbn13(canonicalized);

            if (isbn13Code === Isbn.TOO_SHORT_ERROR && code === Isbn.TOO_LONG_ERROR) {
                code = Isbn.TYPE_NOT_RECOGNIZED_ERROR;
            } else {
                code = isbn13Code;
            }
        }

        if (null !== code) {
            this._context.buildViolation(this._getMessage(constraint))
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(code)
                .addViolation();
        }
    }

    /**
     * Validates ISBN 10.
     *
     * @param {string} isbn
     *
     * @returns {null|int}
     *
     * @protected
     */
    _validateIsbn10(isbn) {
        // Choose an algorithm so that ERROR_INVALID_CHARACTERS is preferred
        // Over ERROR_TOO_SHORT/ERROR_TOO_LONG
        // Otherwise "0-45122-5244" passes, but "0-45122_5244" reports
        // "too long"

        // Error priority:
        // 1. ERROR_INVALID_CHARACTERS
        // 2. ERROR_TOO_SHORT/ERROR_TOO_LONG
        // 3. ERROR_CHECKSUM_FAILED

        let i = 0;
        let checkSum = 0;

        for (; 10 > i; ++i) {
            // If we test the length before the loop, we get an ERROR_TOO_SHORT
            // When actually an ERROR_INVALID_CHARACTERS is wanted, e.g. for
            // "0-45122_5244" (typo)
            if (undefined === isbn[i]) {
                return Isbn.TOO_SHORT_ERROR;
            }

            let digit;
            if ('X' === isbn[i]) {
                digit = 10;
            } else if (isbn[i].match(/[0-9]/)) {
                digit = isbn[i];
            } else {
                return Isbn.INVALID_CHARACTERS_ERROR;
            }

            checkSum += digit * (10 - i);
        }

        if (undefined !== isbn[i]) {
            return Isbn.TOO_LONG_ERROR;
        }

        return 0 === checkSum % 11 ? null : Isbn.CHECKSUM_FAILED_ERROR;
    }

    /**
     * Validates ISBN 13
     *
     * @param {string} isbn
     *
     * @returns {null|int}
     *
     * @protected
     */
    _validateIsbn13(isbn) {
        // Error priority:
        // 1. ERROR_INVALID_CHARACTERS
        // 2. ERROR_TOO_SHORT/ERROR_TOO_LONG
        // 3. ERROR_CHECKSUM_FAILED

        if (! isbn.match(/^[0-9]+$/)) {
            return Isbn.INVALID_CHARACTERS_ERROR;
        }

        let checkSum = 0;
        const length = isbn.length;

        if (13 > length) {
            return Isbn.TOO_SHORT_ERROR;
        }

        if (13 < length) {
            return Isbn.TOO_LONG_ERROR;
        }

        for (let i = 0; 13 > i; i += 2) {
            checkSum += ~~isbn[i];
        }

        for (let i = 1; 12 > i; i += 2) {
            checkSum += ~~isbn[i] * 3;
        }

        return 0 === checkSum % 10 ? null : Isbn.CHECKSUM_FAILED_ERROR;
    }

    /**
     * Gets the message associated to the given constraint.
     *
     * @param {Jymfony.Component.Validator.Constraints.Isbn} constraint
     * @param {string|null} [type = null]
     *
     * @returns {string|*}
     *
     * @protected
     */
    _getMessage(constraint, type = null) {
        if (!! constraint.message) {
            return constraint.message;
        } else if ('isbn10' === type) {
            return constraint.isbn10Message;
        } else if ('isbn13' === type) {
            return constraint.isbn13Message;
        }

        return constraint.bothIsbnMessage;
    }
}
