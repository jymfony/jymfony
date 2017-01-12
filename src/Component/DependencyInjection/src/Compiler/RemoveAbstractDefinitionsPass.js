const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.RemoveAbstractDefinitionsPass}
 */
module.exports = class RemoveAbstractDefinitionsPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        let compiler = container.getCompiler();
        let formatter = compiler.logFormatter;

        for (let [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            if (! definition.isAbstract()) {
                continue;
            }

            container.removeDefinition(id);
            compiler.addLogMessage(formatter.formatRemoveService(this, id, 'abstract'));
        }
    }
};
