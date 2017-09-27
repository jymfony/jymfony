/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.LogFormatter}
 */
module.exports = class LogFormatter {
    formatRemoveService(pass, id, reason) {
        return this.format(pass, `Removed service "${id}"; reason: ${reason}`);
    }

    formatInlineService(pass, id, target) {
        return this.format(pass, `Inlined service "${id}" to "${target}".`);
    }

    formatUpdateReference(pass, serviceId, oldDestId, newDestId) {
        return this.format(pass, `Changed reference of service "${serviceId}" previously pointing to "${oldDestId}" to "${newDestId}".`);
    }

    formatResolveInheritance(pass, childId, parentId) {
        return this.format(pass, `Resolving inheritance for "${childId}" (parent: ${parentId}).`);
    }

    format(pass, message) {
        const reflClass = new ReflectionClass(pass);
        return reflClass.name + ': ' + message;
    }
};
