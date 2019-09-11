const Container = Jymfony.Component.DependencyInjection.Container;

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
export default class Reference {
    /**
     * Constructor.
     *
     * @param {string} id
     * @param {int} [invalidBehavior = Jymfony.Component.DependencyInjection.Container.EXCEPTION_ON_INVALID_REFERENCE]
     */
    __construct(id, invalidBehavior = Container.EXCEPTION_ON_INVALID_REFERENCE) {
        this._id = Container.normalizeId(id);
        this._invalidBehavior = invalidBehavior;
    }

    /**
     * @returns {string}
     */
    toString() {
        return this._id;
    }

    /**
     * @returns {int}
     */
    get invalidBehavior() {
        return this._invalidBehavior;
    }
}
