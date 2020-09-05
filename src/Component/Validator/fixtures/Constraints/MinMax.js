/**
 * @memberOf Jymfony.Component.Validator.Fixtures.Constraints
 */
export default class MinMax {
    __construct(min, max) {
        this._min = min;
        this._max = max;
    }

    get min() {
        return this._min;
    }

    get max() {
        return this._max;
    }
}
