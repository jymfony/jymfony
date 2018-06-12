const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class CheckDefinitionValidityPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        for (const [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            if (definition.isSynthetic() && ! definition.isPublic()) {
                throw new RuntimeException(`A synthetic service ("${id}") must be public`);
            }

            if (! definition.isAbstract() && ! definition.isSynthetic() && ! definition.getFactory() && ! definition.getClass() && ! definition.getModule()) {
                throw new RuntimeException(
                    `The definition for service "${id}" has no class. If you intend to inject this service ` +
                    'dynamically at runtime, please mark it as synthetic. If this is an abstract definition ' +
                    'solely used by child ones, please mark as abstract.'
                );
            }

            for (const [ name, tags ] of __jymfony.getEntries(definition.getTags())) {
                for (const attributes of tags) {
                    for (const [ attribute, value ] of __jymfony.getEntries(attributes)) {
                        if (! isScalar(value) && !! value) {
                            throw new RuntimeException(`A "tags" attribute must be of a scalar-type for service "${id}", tag "${name}", attribute "${attribute}"`);
                        }
                    }
                }
            }
        }
    }
}

module.exports = CheckDefinitionValidityPass;
