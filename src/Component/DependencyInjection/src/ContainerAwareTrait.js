/**
 * @memberOf Jymfony.DependencyInjection
 * @type {Jymfony.DependencyInjection.ContainerAwareTrait}
 */
module.exports = getTrait(class ContainerAwareTrait {
    /**
     * Sets the container
     *
     * @param {Jymfony.DependencyInjection.Container} container
     */
    setContainer(container) {
        /**
         * Service container
         *
         * @type {Jymfony.DependencyInjection.Container}
         * @protected
         */
        this._container = container;
    }
});
