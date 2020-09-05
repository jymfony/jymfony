/**
 * @memberOf Jymfony.Component.Validator.Fixtures.Constraints
 */
export default class Limit {
    __construct(value) {
        this._value = value;
    }

    get value() {
        return this._value;
    }
}
