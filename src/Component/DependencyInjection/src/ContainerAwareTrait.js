/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ContainerAwareTrait {
    __construct() {
        /**
         * Service container.
         *
         * @type {Jymfony.Component.DependencyInjection.Container}
         *
         * @protected
         */
        this._container = undefined;
    }

    /**
     * Sets the container.
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container
     */
    setContainer(container) {
        this._container = container;
    }
}

module.exports = getTrait(ContainerAwareTrait);
