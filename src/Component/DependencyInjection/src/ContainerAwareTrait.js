/**
 * @memberOf Jymfony.Component.DependencyInjection
 * @type {Jymfony.Component.DependencyInjection.ContainerAwareTrait}
 */
module.exports = getTrait(class ContainerAwareTrait {
    /**
     * Sets the container
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container
     */
    setContainer(container) {
        /**
         * Service container
         *
         * @type {Jymfony.Component.DependencyInjection.Container}
         * @protected
         */
        this._container = container;
    }
});
