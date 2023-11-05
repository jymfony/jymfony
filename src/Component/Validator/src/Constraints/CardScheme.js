const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class CardScheme extends Constraint {
    message = 'Unsupported card type or invalid card number.';
    schemes;

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.NOT_NUMERIC_ERROR: return 'NOT_NUMERIC_ERROR';
            case __self.INVALID_FORMAT_ERROR: return 'INVALID_FORMAT_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'schemes';
    }

    /**
     * @inheritdoc
     */
    get requiredOptions() {
        return [ 'schemes' ];
    }
}

Object.defineProperties(CardScheme, {
    NOT_NUMERIC_ERROR: { value: 'a2ad9231-e827-485f-8a1e-ef4d9a6d5c2e', writable: false },
    INVALID_FORMAT_ERROR: { value: 'a8faedbf-1c2f-4695-8d22-55783be8efed', writable: false },
});
