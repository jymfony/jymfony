const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
module.exports = class ReplaceAliasByActualDefinitionPass extends AbstractRecursivePass {
    process(container) {
        // First collect all alias targets that need to be replaced
        const seenAliasTargets = {};
        const replacements = {};
        for (const [ definitionId, target ] of __jymfony.getEntries(container.getAliases())) {
            const targetId = target.toString();

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

        this._replacements = replacements;

        super.process(container);
        this._replacements = {};
    }

    _processValue(value, isRoot = false) {
        if (value instanceof Reference && undefined !== this._replacements[value.toString()]) {
            // Perform the replacement.
            const newId = this._replacements[value.toString()];
            const value = new Reference(newId, value.invalidBehavior);
            this._container.log(this, __jymfony.sprintf('Changed reference of service "%s" previously pointing to "%s" to "%s".', this._currentId, value.toString(), newId));
        }

        return super._processValue(value, isRoot);
    }
};
