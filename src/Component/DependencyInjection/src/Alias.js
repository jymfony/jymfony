/**
 * @memberOf Jymfony.DependencyInjection
 */
module.exports = class Alias {
    constructor(id, public_ = false) {
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
     */
    setPublic(public_) {
        this._public = !! public_;
    }

    /**
     * Returns the Id of this alias
     *
     * @returns {*}
     */
    toString() {
        return this._id;
    }
};
