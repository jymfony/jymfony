const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class RemovePrivateAliasesPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        const compiler = container.getCompiler();
        const formatter = compiler.logFormatter;

        for (const [ id, alias ] of __jymfony.getEntries(container.getAliases())) {
            if (alias.isPublic()) {
                continue;
            }

            container.removeAlias(id);
            compiler.addLogMessage(formatter.formatRemoveService(this, id, 'private alias'));
        }
    }
}

module.exports = RemovePrivateAliasesPass;
