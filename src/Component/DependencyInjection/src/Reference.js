const Container = Jymfony.Component.DependencyInjection.Container;

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class Reference {
    __construct(id, invalidBehavior = Container.EXCEPTION_ON_INVALID_REFERENCE) {
        this._id = id.toLowerCase();
        this._invalidBehavior = invalidBehavior;
    }

    toString() {
        return this._id;
    }

    get invalidBehavior() {
        return this._invalidBehavior;
    }
}

module.exports = Reference;
