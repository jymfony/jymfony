const Container = Jymfony.Component.DependencyInjection.Container;

/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
export default class Alias {
    /**
     * Constructor.
     *
     * @param {string} id
     * @param {boolean} [public_ = false]
     */
    __construct(id, public_ = false) {
        this._id = Container.normalizeId(id);
        this._public = public_;
    }

    /**
     * Checks if should be public.
     *
     * @returns {boolean}
     */
    isPublic() {
        return this._public;
    }

    /**
     * Sets if this Alias is public.
     *
     * @param {boolean} public_
     *
     * @returns {Jymfony.Component.DependencyInjection.Alias}
     */
    setPublic(public_) {
        this._public = !! public_;

        return this;
    }

    /**
     * Returns the Id of this alias.
     *
     * @returns {string}
     */
    toString() {
        return this._id;
    }
}
