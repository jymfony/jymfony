/**
 * @memberOf Jymfony.Component.Validator.Fixtures.Constraints
 */
export default class ComparisonTest_Class {
    __construct(value) {
        this._value = value;
    }

    toString() {
        return String(this._value);
    }

    get value() {
        return this._value;
    }
}
