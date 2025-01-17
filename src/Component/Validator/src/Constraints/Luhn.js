const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Luhn extends Constraint {
    message = 'Invalid card number.';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.INVALID_CHARACTERS_ERROR: return 'INVALID_CHARACTERS_ERROR';
            case __self.CHECKSUM_FAILED_ERROR: return 'CHECKSUM_FAILED_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperties(Luhn, {
    INVALID_CHARACTERS_ERROR: { value: 'dfad6d23-1b74-4374-929b-5cbb56fc0d9e', writable: false },
    CHECKSUM_FAILED_ERROR: { value: '4d760774-3f50-4cd5-a6d5-b10a3299d8d3', writable: false },
});
