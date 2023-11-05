const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Iban extends Constraint {
    message = 'This is not a valid International Bank Account Number (IBAN).';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case Iban.INVALID_COUNTRY_CODE_ERROR: return 'INVALID_COUNTRY_CODE_ERROR';
            case Iban.INVALID_CHARACTERS_ERROR: return 'INVALID_CHARACTERS_ERROR';
            case Iban.CHECKSUM_FAILED_ERROR: return 'CHECKSUM_FAILED_ERROR';
            case Iban.INVALID_FORMAT_ERROR: return 'INVALID_FORMAT_ERROR';
            case Iban.NOT_SUPPORTED_COUNTRY_CODE_ERROR: return 'NOT_SUPPORTED_COUNTRY_CODE_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperties(Iban, {
    INVALID_COUNTRY_CODE_ERROR: { value: 'de78ee2c-bd50-44e2-aec8-3d8228aeadb9', writable: false },
    INVALID_CHARACTERS_ERROR: { value: '8d3d85e4-784f-4719-a5bc-d9e40d45a3a5', writable: false },
    CHECKSUM_FAILED_ERROR: { value: 'b9401321-f9bf-4dcb-83c1-f31094440795', writable: false },
    INVALID_FORMAT_ERROR: { value: 'c8d318f1-2ecc-41ba-b983-df70d225cf5a', writable: false },
    NOT_SUPPORTED_COUNTRY_CODE_ERROR: { value: 'e2c259f3-4b46-48e6-b72e-891658158ec8', writable: false },
});
