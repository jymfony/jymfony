const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class AliasDeprecatedPublicServicesPass extends AbstractRecursivePass {
    /**
     * Constructor.
     *
     * @param {string} tagName
     */
    __construct(tagName = 'container.private') {
        super.__construct();

        /**
         * @type {string}
         *
         * @private
         */
        this._tagName = tagName;

        /**
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._aliases = {};
    }

    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        const id = String(value);
        if (value instanceof Reference && undefined !== this._aliases[id]) {
            return new Reference(this._aliases[id], value.invalidBehavior);
        }

        return super._processValue(value, isRoot);
    }

    /**
     * @inheritdoc
     */
    process(container) {
        for (const id of Object.keys(container.findTaggedServiceIds(this._tagName))) {
            const definition = container.getDefinition(id);
            if (! definition.isPublic()) {
                throw new InvalidArgumentException(__jymfony.sprintf('The "%s" service is private: it cannot have the "%s" tag.', id, this._tagName));
            }

            const aliasId = '.' + this._tagName + '.' + id;
            container
                .setAlias(id, aliasId)
                .setPublic(true)
                .setDeprecated(true, 'Accessing the "%alias_id%" service directly from the container is deprecated, use dependency injection instead.');

            container.setDefinition(aliasId, definition);
            this._aliases[id] = aliasId;
        }

        super.process(container);
    }
}
