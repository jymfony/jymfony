const IteratorArgument = Jymfony.Component.DependencyInjection.Argument.IteratorArgument;

/**
 * Represents a collection of services found by tag name to lazily iterate over.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 */
class TaggedIteratorArgument extends IteratorArgument {
    /**
     * Constructor.
     *
     * @param {string} tag
     */
    __construct(tag) {
        super.__construct([]);

        /**
         * @type {string}
         *
         * @private
         */
        this._tag = tag;
    }

    /**
     * Gets the target tag.
     *
     * @returns {string}
     */
    get tag() {
        return this._tag;
    }
}

module.exports = TaggedIteratorArgument;
