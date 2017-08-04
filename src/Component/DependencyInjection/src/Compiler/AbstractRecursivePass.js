const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Definition = Jymfony.Component.DependencyInjection.Definition;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @abstract
 */
class AbstractRecursivePass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritDoc
     */
    process(container) {
        /**
         * @type {string}
         * @protected
         */
        this._currentId = undefined;

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         * @protected
         */
        this._container = container;

        try {
            this._processValue(this._container.getDefinitions(), true);
        } finally {
            this._container = undefined;
        }
    }

    /**
     * Processes a value found in a definition tree.
     *
     * @param {*} value
     * @param {boolean} isRoot
     *
     * @returns {*} The processed value
     */
    _processValue(value, isRoot = false) {
        if (isArray(value) || isObjectLiteral(value)) {
            for (let [ k, v ] of __jymfony.getEntries(value)) {
                if (isRoot) {
                    this._currentId = k;
                }

                let processedValue;
                if (v !== (processedValue = this._processValue(v, isRoot))) {
                    value[k] = processedValue;
                }
            }
        } else if (value instanceof ArgumentInterface) {
            value.values = this._processValue(value.values);
        } else if (value instanceof Definition) {
            value.setArguments(this._processValue(value.getArguments()));
            value.setProperties(this._processValue(value.getProperties()));
            value.setMethodCalls(this._processValue(value.getMethodCalls()));

            let changes = value.getChanges();
            if (changes['factory']) {
                value.setFactory(this._processValue(value.getFactory()));
            }
            if (changes['configurator']) {
                value.setConfigurator(this._processValue(value.getConfigurator()));
            }
        }

        return value;
    }
}

module.exports = AbstractRecursivePass;
