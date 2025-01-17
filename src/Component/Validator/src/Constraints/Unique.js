const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Unique extends Constraint {
    message = 'This collection should contain only unique elements.';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (__self.IS_NOT_UNIQUE === errorCode) {
            return 'IS_NOT_UNIQUE';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperty(Unique, 'IS_NOT_UNIQUE', { value: '7911c98d-b845-4da0-94b7-a8dac36bc55a', writable: false });
