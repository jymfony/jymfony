const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Issn extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.TOO_SHORT_ERROR: return 'TOO_SHORT_ERROR';
            case __self.TOO_LONG_ERROR: return 'TOO_LONG_ERROR';
            case __self.MISSING_HYPHEN_ERROR: return 'MISSING_HYPHEN_ERROR';
            case __self.INVALID_CHARACTERS_ERROR: return 'INVALID_CHARACTERS_ERROR';
            case __self.INVALID_CASE_ERROR: return 'INVALID_CASE_ERROR';
            case __self.CHECKSUM_FAILED_ERROR: return 'CHECKSUM_FAILED_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value is not a valid ISSN.';
        this.caseSensitive = false;
        this.requireHyphen = false;

        return super.__construct(options);
    }
}

Object.defineProperties(Issn, {
    TOO_SHORT_ERROR: { value: '6a20dd3d-f463-4460-8e7b-18a1b98abbfb', writable: false },
    TOO_LONG_ERROR: { value: '37cef893-5871-464e-8b12-7fb79324833c', writable: false },
    MISSING_HYPHEN_ERROR: { value: '2983286f-8134-4693-957a-1ec4ef887b15', writable: false },
    INVALID_CHARACTERS_ERROR: { value: 'a663d266-37c2-4ece-a914-ae891940c588', writable: false },
    INVALID_CASE_ERROR: { value: '7b6dd393-7523-4a6c-b84d-72b91bba5e1a', writable: false },
    CHECKSUM_FAILED_ERROR: { value: 'b0f92dbc-667c-48de-b526-ad9586d43e85', writable: false },
});
