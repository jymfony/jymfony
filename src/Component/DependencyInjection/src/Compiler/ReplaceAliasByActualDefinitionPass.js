const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ReplaceAliasByActualDefinitionPass extends AbstractRecursivePass {
    __construct() {
        super.__construct();

        /**
         * @type {Object}
         *
         * @private
         */
        this._replacements = {};
    }

    /**
     * @inheritdoc
     */
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
                container.setAlias(definitionId, replacements[targetId]).setPublic(target.isPublic());
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
            definition.setPublic(target.isPublic());
            container.setDefinition(definitionId, definition);
            container.removeDefinition(targetId);

            replacements[targetId] = definitionId;
        }

        this._replacements = replacements;

        super.process(container);

        this._replacements = {};
    }

    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        const compiler = this._container.getCompiler();
        const formatter = compiler.logFormatter;

        if (value instanceof Reference && undefined !== this._replacements[value.toString()]) {
            // Perform the replacement.
            const newId = this._replacements[value.toString()];
            value = new Reference(newId, value.invalidBehavior);

            compiler.addLogMessage(formatter.formatUpdateReference(this, this._currentId, value.toString(), newId));
        }

        return super._processValue(value, isRoot);
    }
}
