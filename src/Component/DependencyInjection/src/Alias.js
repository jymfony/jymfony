/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class Alias {
    __construct(id, public_ = false) {
        this._id = id;
        this._public = public_;
    }

    /**
     * Checks if should be public
     *
     * @returns {boolean}
     */
    isPublic() {
        return this._public;
    }

    /**
     * Sets if this Alias is public
     *
     * @param public_
     *
     * @returns {Jymfony.Component.DependencyInjection.Alias}
     */
    setPublic(public_) {
        this._public = !! public_;

        return this;
    }

    /**
     * Returns the Id of this alias
     *
     * @returns {*}
     */
    toString() {
        return this._id;
    }
}

module.exports = Alias;
