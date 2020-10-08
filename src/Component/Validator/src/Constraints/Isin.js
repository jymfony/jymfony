const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Isin extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.INVALID_LENGTH_ERROR: return 'INVALID_LENGTH_ERROR';
            case __self.INVALID_PATTERN_ERROR: return 'INVALID_PATTERN_ERROR';
            case __self.INVALID_CHECKSUM_ERROR: return 'INVALID_CHECKSUM_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This is not a valid International Securities Identification Number (ISIN).';

        return super.__construct(options);
    }
}

Object.defineProperties(Isin, {
    VALIDATION_LENGTH: { value: 12, writable: false },
    VALIDATION_PATTERN: { value: /[A-Z]{2}[A-Z0-9]{9}[0-9]/, writable: false },

    INVALID_LENGTH_ERROR: { value: '88738dfc-9ed5-ba1e-aebe-402a2a9bf58e', writable: false },
    INVALID_PATTERN_ERROR: { value: '3d08ce0-ded9-a93d-9216-17ac21265b65e', writable: false },
    INVALID_CHECKSUM_ERROR: { value: '32089b-0ee1-93ba-399e-aa232e62f2d29d', writable: false },
});
