const Alias = Jymfony.DependencyInjection.Alias;
const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.DecoratorServicePass}
 */
module.exports = class DecoratorServicePass extends implementationOf(CompilerPassInterface) {
    process(container) {
        let definitions = new PriorityQueue();

        for (let [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            let decorated = definition.getDecoratedService();
            if (! decorated) {
                continue;
            }

            definitions.push([ id, definition ], decorated[2]);
        }

        for (let [ id, definition ] of definitions) {
            let [ inner, renamedId, priority ] = definition.getDecoratedService();
            definition.setDecoratedService(undefined);

            if (! renamedId) {
                renamedId = id + '.inner';
            }

            let public_;
            if (container.hasAlias(inner)) {
                let alias = container.getAlias(inner);
                public_ = alias.isPublic();
                container.setAlias(renamedId, new Alias(alias.toString(), false));
            } else {
                let decoratedDefinition = container.getDefinition(inner);
                definition.setTags(__jymfony.objectMerge(decoratedDefinition.getTags(), definition.getTags()));
                public_ = decoratedDefinition.isPublic();
                decoratedDefinition.setPublic(false);
                decoratedDefinition.setTags({});
                container.setDefinition(renamedId, decoratedDefinition);
            }

            container.setAlias(inner, new Alias(id, public_));
        }
    }
};
