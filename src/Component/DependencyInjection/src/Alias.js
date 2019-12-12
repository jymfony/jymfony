const Container = Jymfony.Component.DependencyInjection.Container;

const defaultDeprecationTemplate = 'The "%alias_id%" service alias is deprecated. You should stop using it, as it will be removed in the future.';

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
        /**
         * @type {string}
         *
         * @private
         */
        this._id = Container.normalizeId(id);

        /**
         * @type {boolean}
         *
         * @private
         */
        this._public = public_;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._deprecated = false;

        /**
         * @type {string}
         *
         * @private
         */
        this._deprecationTemplate = undefined;
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
     * Whether this alias is deprecated, that means it should not be referenced
     * anymore.
     *
     * @param {boolean} status Whether this alias is deprecated, defaults to true
     * @param {string} template Optional template message to use if the alias is deprecated
     *
     * @returns {Jymfony.Component.DependencyInjection.Alias}
     *
     * @throws {InvalidArgumentException} when the message template is invalid
     */
    setDeprecated(status = true, template = defaultDeprecationTemplate) {
        if (template) {
            if (/[\r\n]|\*\//.test(template)) {
                throw new InvalidArgumentException('Invalid characters found in deprecation notice template');
            }

            this._deprecationTemplate = template;
        }

        this._deprecated = !! status;

        return this;
    }

    /**
     * Checks whether this service is deprecated.
     *
     * @returns {boolean}
     */
    isDeprecated() {
        return this._deprecated;
    }

    /**
     * Build the deprecation message for a given alias id.
     *
     * @param {string} id
     *
     * @returns {string}
     */
    getDeprecationMessage(id) {
        return this._deprecationTemplate.replace(/%alias_id%/g, id);
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
