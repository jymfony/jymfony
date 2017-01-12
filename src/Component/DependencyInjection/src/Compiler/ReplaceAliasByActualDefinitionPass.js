const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ReplaceAliasByActualDefinitionPass}
 */
module.exports = class ReplaceAliasByActualDefinitionPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        // Setup
        this._compiler = container.getCompiler();
        this._formatter = this._compiler.logFormatter;

        // First collect all alias targets that need to be replaced
        let seenAliasTargets = {};
        let replacements = {};
        for (let [ definitionId, target ] of __jymfony.getEntries(container.getAliases())) {
            let targetId = target.toString();

            // Special case: leave this target alone
            if ('service_container' === targetId) {
                continue;
            }

            // Check if target needs to be replaces
            if (replacements[targetId]) {
                container.setAlias(definitionId, replacements[targetId]);
            }

            // No need to process the same target twice
            if (seenAliasTargets[targetId]) {
                continue;
            }

            // Process new target
            seenAliasTargets[targetId] = true;
            let definition;

            try {
                definition = container.getDefinition(targetId);
            } catch (e) {
                throw new InvalidArgumentException(`Unable to replace alias "${definitionId}" with actual definition "${targetId}".`, e);
            }

            if (definition.isPublic()) {
                continue;
            }

            // Remove private definition and schedule for replacement
            definition.setPublic(true);
            container.setDefinition(definitionId, definition);
            container.removeDefinition(targetId);

            replacements[targetId] = definitionId;
        }

        // Now replace target instances in all definitions
        for (let [ definitionId, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            definition.setArguments(this._updateArgumentReferences(replacements, definitionId, definition.getArguments()));
            definition.setMethodCalls(this._updateArgumentReferences(replacements, definitionId, definition.getMethodCalls()));
            definition.setProperties(this._updateArgumentReferences(replacements, definitionId, definition.getProperties()));
            definition.setFactory(this._updateFactoryReference(replacements, definition.getFactory()));
        }
    }

    _updateArgumentReferences(replacements, definitionId, args) {
        for (let [ k, argument ] of __jymfony.getEntries(args)) {
            // Handle recursion step
            if (isArray(argument) || isObjectLiteral(argument)) {
                args[k] = this._updateArgumentReferences(replacements, definitionId, argument);
                continue;
            }

            // Skip args that don't need replacement
            if (! (argument instanceof Reference)) {
                continue;
            }

            let referenceId = argument.toString();
            if (! replacements[referenceId]) {
                continue;
            }

            // Perform the replacement
            let newId = replacements[referenceId];
            args[k] = new Reference(newId, argument.invalidBehavior);
            this._compiler.addLogMessage(this._formatter.formatUpdateReference(this, definitionId, referenceId, newId));
        }

        return args;
    }

    _updateFactoryReference(replacements, factory) {
        let referenceId;
        if (isArray(factory) && factory[0] instanceof Reference && replacements[referenceId = factory[0].toString()]) {
            factory[0] = new Reference(replacements[referenceId], factory[0].invalidBehavior);
        }

        return factory;
    }
};
