const Reference = Jymfony.Component.DependencyInjection.Reference;

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

        services.ksort();

        for (let refs of services) {
            yield * refs;
        }
    }
}

module.exports = getTrait(PriorityTaggedServiceTrait);
