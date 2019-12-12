/**
 * @memberOf Jymfony.Component.PropertyAccess.Fixtures
 */
export default class TestClass {
    __construct(value) {
        this.publicProperty = value;
        this._publicAccessor = value;
        this._publicMethodAccessor = value;
        this._publicGetSetter = value;
        this._publicAccessorWithDefaultValue = value;
        this._publicAccessorWithRequiredAndDefaultValue = value;
        this._publicAccessorWithMoreRequiredParameters = value;
        this._publicIsAccessor = value;
        this._publicHasAccessor = value;
        this._publicGetter = value;
        this._date = undefined;
    }

    setPublicAccessor(value) {
        this._publicAccessor = value;
    }

    setPublicAccessorWithDefaultValue(value = null) {
        this._publicAccessorWithDefaultValue = value;
    }

    // eslint-disable-next-line no-unused-vars
    setPublicAccessorWithRequiredAndDefaultValue(value, optional = null) {
        this._publicAccessorWithRequiredAndDefaultValue = value;
    }

    // eslint-disable-next-line no-unused-vars
    setPublicAccessorWithMoreRequiredParameters(value, needed) {
        this._publicAccessorWithMoreRequiredParameters = value;
    }

    getPublicAccessor() {
        return this._publicAccessor;
    }

    getPublicAccessorWithDefaultValue() {
        return this._publicAccessorWithDefaultValue;
    }

    getPublicAccessorWithRequiredAndDefaultValue() {
        return this._publicAccessorWithRequiredAndDefaultValue;
    }

    getPublicAccessorWithMoreRequiredParameters() {
        return this._publicAccessorWithMoreRequiredParameters;
    }

    setPublicIsAccessor(value) {
        this._publicIsAccessor = value;
    }

    isPublicIsAccessor() {
        return this._publicIsAccessor;
    }

    setPublicHasAccessor(value) {
        this._publicHasAccessor = value;
    }

    hasPublicHasAccessor() {
        return this._publicHasAccessor;
    }

    publicGetSetter(value = null) {
        if (null !== value) {
            this._publicGetSetter = value;
        }

        return this._publicGetSetter;
    }

    getPublicMethodMutator() {
        return this._publicGetSetter;
    }

    getPublicGetter() {
        return this._publicGetter;
    }

    setDate(date) {
        this._date = date;
    }

    getDate() {
        return this._date;
    }
}
