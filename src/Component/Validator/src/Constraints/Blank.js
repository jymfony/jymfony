const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Blank extends Constraint {
    message = 'This value should be blank.';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (Blank.NOT_BLANK_ERROR === errorCode) {
            return 'NOT_BLANK_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperty(Blank, 'NOT_BLANK_ERROR', { value: '183ad2de-533d-4796-a439-6d3c3852b549', writable: false });
