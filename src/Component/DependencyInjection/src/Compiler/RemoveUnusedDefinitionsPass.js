const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class RemoveUnusedDefinitionsPass extends AbstractRecursivePass {
    __construct() {
        /**
         * @type {string[]}
         *
         * @private
         */
        this._connectedIds = [];
    }

    /**
     * Processes the ContainerBuilder to remove unused definitions.
     */
    process(container) {
        const compiler = container.getCompiler();

        try {
            const connectedIds = new Set();
            const aliases = container.getAliases();

            for (const [ id, alias ] of __jymfony.getEntries(aliases)) {
                if (alias.isPublic()) {
                    this._connectedIds.push(String(aliases[id]));
                }
            }

            for (const [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
                if (definition.isPublic()) {
                    connectedIds.add(id);
                    this._processValue(definition);
                }
            }

            while (0 < this._connectedIds.length) {
                const ids = [ ...this._connectedIds ];
                this._connectedIds = [];
                for (const id of ids) {
                    if (! connectedIds.has(id) && container.hasDefinition(id)) {
                        connectedIds.add(id);
                        this._processValue(container.getDefinition(id));
                    }
                }
            }

            for (const id of Object.keys(container.getDefinitions())) {
                if (! connectedIds.has(id)) {
                    container.removeDefinition(id);
                    compiler.addLogMessage(compiler.logFormatter.formatRemoveService(this, id, 'unused'));
                }
            }
        } finally {
            this._connectedIds = [];
        }
    }

    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (! (value instanceof Reference)) {
            return super._processValue(value, isRoot);
        }

        if (Container.IGNORE_ON_UNINITIALIZED_REFERENCE !== value.invalidBehavior) {
            this._connectedIds.push(String(value));
        }

        return value;
    }
}
