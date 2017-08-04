const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class PriorityTaggedServiceTrait {
    /**
     *
     * @param {String} tagName
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    * findAndSortTaggedServices(tagName, container) {
        let services = {};

        for (let [ serviceId, attributes ] of __jymfony.getEntries(container.findTaggedServiceIds(tagName))) {
            let priority = attributes[0].priority === undefined ? 0 : attributes[0].priority;

            if (services[priority] === undefined) {
                services[priority] = [];
            }

            services[priority].push(new Reference(serviceId));
        }

        services = Object.ksort(services);

        for (let refs of Object.values(services)) {
            yield * refs;
        }
    }
}

module.exports = getTrait(PriorityTaggedServiceTrait);
