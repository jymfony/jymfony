const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Isbn extends Constraint {
    isbn10Message = 'This value is not a valid ISBN-10.';
    isbn13Message = 'This value is not a valid ISBN-13.';
    bothIsbnMessage = 'This value is neither a valid ISBN-10 nor a valid ISBN-13.';
    type;
    message;

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.TOO_SHORT_ERROR: return 'TOO_SHORT_ERROR';
            case __self.TOO_LONG_ERROR: return 'TOO_LONG_ERROR';
            case __self.INVALID_CHARACTERS_ERROR: return 'INVALID_CHARACTERS_ERROR';
            case __self.CHECKSUM_FAILED_ERROR: return 'CHECKSUM_FAILED_ERROR';
            case __self.TYPE_NOT_RECOGNIZED_ERROR: return 'TYPE_NOT_RECOGNIZED_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    get defaultOption() {
        return 'type';
    }
}

Object.defineProperties(Isbn, {
    TOO_SHORT_ERROR: { value: '949acbb0-8ef5-43ed-a0e9-032dfd08ae45', writable: false },
    TOO_LONG_ERROR: { value: '3171387d-f80a-47b3-bd6e-60598545316a', writable: false },
    INVALID_CHARACTERS_ERROR: { value: '23d21cea-da99-453d-98b1-a7d916fbb339', writable: false },
    CHECKSUM_FAILED_ERROR: { value: '2881c032-660f-46b6-8153-d352d9706640', writable: false },
    TYPE_NOT_RECOGNIZED_ERROR: { value: 'fa54a457-f042-441f-89c4-066ee5bdd3e1', writable: false },
});
