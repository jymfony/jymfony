const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.RemovePrivateAliasesPass}
 */
module.exports = class RemovePrivateAliasesPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        let compiler = container.getCompiler();
        let formatter = compiler.logFormatter;

        for (let [id, alias] of __jymfony.getEntries(container.getAliases())) {
            if (alias.isPublic()) {
                continue;
            }

            container.removeAlias(id);
            compiler.addLogMessage(formatter.formatRemoveService(this, id, 'private alias'));
        }
    }
};
