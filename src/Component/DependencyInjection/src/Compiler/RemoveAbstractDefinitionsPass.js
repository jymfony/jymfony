const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class RemoveAbstractDefinitionsPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        const compiler = container.getCompiler();
        const formatter = compiler.logFormatter;

        for (const [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            if (! definition.isAbstract()) {
                continue;
            }

            container.removeDefinition(id);
            compiler.addLogMessage(formatter.formatRemoveService(this, id, 'abstract'));
        }
    }
}

module.exports = RemoveAbstractDefinitionsPass;
