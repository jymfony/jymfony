const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class PriorityTaggedServiceTrait {
    /**
     * Finds all services with the given tag name and order them by their priority.
     *
     * @param {string} tagName
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @returns {Generator|Jymfony.Component.DependencyInjection.Reference[]}
     */
    * findAndSortTaggedServices(tagName, container) {
        const services = {};

        for (const [ serviceId, attributes ] of __jymfony.getEntries(container.findTaggedServiceIds(tagName))) {
            const priority = attributes[0].priority === undefined ? 0 : attributes[0].priority;

            if (services[priority] === undefined) {
                services[priority] = [];
            }

            services[priority].push(new Reference(serviceId));
        }

        const priorities = Object.keys(services).sort((a, b) => a - b);

        for (const p of priorities.reverse()) {
            yield * services[p];
        }
    }
}

export default getTrait(PriorityTaggedServiceTrait);
