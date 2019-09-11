/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class LogFormatter {
    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} id
     * @param {string} reason
     *
     * @returns {string}
     */
    formatRemoveService(pass, id, reason) {
        return this.format(pass, `Removed service "${id}"; reason: ${reason}`);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} id
     * @param {string} target
     *
     * @returns {string}
     */
    formatInlineService(pass, id, target) {
        return this.format(pass, `Inlined service "${id}" to "${target}".`);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} serviceId
     * @param {string} oldDestId
     * @param {string} newDestId
     *
     * @returns {string}
     */
    formatUpdateReference(pass, serviceId, oldDestId, newDestId) {
        return this.format(pass, `Changed reference of service "${serviceId}" previously pointing to "${oldDestId}" to "${newDestId}".`);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} childId
     * @param {string} parentId
     *
     * @returns {string}
     */
    formatResolveInheritance(pass, childId, parentId) {
        return this.format(pass, `Resolving inheritance for "${childId}" (parent: ${parentId}).`);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} message
     *
     * @returns {string}
     */
    format(pass, message) {
        const reflClass = new ReflectionClass(pass);

        return reflClass.name + ': ' + message;
    }
}
