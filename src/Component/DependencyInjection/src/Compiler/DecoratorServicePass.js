const Alias = Jymfony.Component.DependencyInjection.Alias;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class DecoratorServicePass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        const definitions = new PriorityQueue();

        for (const [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            const decorated = definition.getDecoratedService();
            if (! decorated) {
                continue;
            }

            definitions.push([ id, definition ], decorated[2]);
        }

        for (const [ id, definition ] of definitions) {
            let [ inner, renamedId ] = definition.getDecoratedService();
            definition.setDecoratedService(undefined);

            if (! renamedId) {
                renamedId = id + '.inner';
            }

            let public_;
            if (container.hasAlias(inner)) {
                const alias = container.getAlias(inner);
                public_ = alias.isPublic();
                container.setAlias(renamedId, new Alias(alias.toString(), false));
            } else {
                const decoratedDefinition = container.getDefinition(inner);
                definition.setTags(__jymfony.objectMerge(decoratedDefinition.getTags(), definition.getTags()));
                public_ = decoratedDefinition.isPublic();
                decoratedDefinition.setPublic(false);
                decoratedDefinition.setTags({});
                container.setDefinition(renamedId, decoratedDefinition);
            }

            container.setAlias(inner, new Alias(id, public_));
        }
    }
}

module.exports = DecoratorServicePass;
