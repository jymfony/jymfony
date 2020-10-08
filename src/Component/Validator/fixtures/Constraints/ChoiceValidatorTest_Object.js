/**
 * @memberOf Jymfony.Component.Validator.Fixtures.Constraints
 */
export default class ChoiceValidatorTest_Object {
    static staticCallback() {
        return [ 'foo', 'bar' ];
    }

    objectMethodCallback() {
        return [ 'foo', 'bar' ];
    }
}
