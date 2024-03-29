const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Choice extends Constraint {
    choices;
    callback;
    multiple = false;
    min;
    max;
    message = 'The value you selected is not a valid choice.';
    multipleMessage = 'One or more of the given values is invalid.';
    minMessage = 'You must select at least {{ limit }} choice.|You must select at least {{ limit }} choices.';
    maxMessage = 'You must select at most {{ limit }} choice.|You must select at most {{ limit }} choices.';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.NO_SUCH_CHOICE_ERROR: return 'NO_SUCH_CHOICE_ERROR';
            case __self.TOO_FEW_ERROR: return 'TOO_FEW_ERROR';
            case __self.TOO_MANY_ERROR: return 'TOO_MANY_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'choices';
    }
}

Object.defineProperties(Choice, {
    NO_SUCH_CHOICE_ERROR: { value: '8e179f1b-97aa-4560-a02f-2a8b42e49df7', writable: false },
    TOO_FEW_ERROR: { value: '11edd7eb-5872-4b6e-9f12-89923999fd0e', writable: false },
    TOO_MANY_ERROR: { value: '9bd98e49-211c-433f-8630-fd1c2d0f08c3', writable: false },
});
