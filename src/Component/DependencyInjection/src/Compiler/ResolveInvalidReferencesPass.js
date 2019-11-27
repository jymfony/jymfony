const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const ServiceClosureArgument = Jymfony.Component.DependencyInjection.Argument.ServiceClosureArgument;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Container = Jymfony.Component.DependencyInjection.Container;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveInvalidReferencesPass extends implementationOf(CompilerPassInterface) {
    __construct() {
        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @private
         */
        this._container = undefined;

        /**
         * @type {RuntimeException}
         *
         * @private
         */
        this._signalingException = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._currentId = undefined;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        let definition;
        this._container = container;
        this._signalingException = new RuntimeException('Invalid reference.');

        try {
            for ([ this._currentId, definition ] of __jymfony.getEntries(container.getDefinitions())) {
                this._processValue(definition);
            }
        } finally {
            this._container = this._signalingException = undefined;
        }
    }

    /**
     * Processes arguments to determine invalid references.
     *
     * @returns {*}
     *
     * @throws {RuntimeException} When an invalid reference is found
     */
    _processValue(value, rootLevel = 0, level = 0) {
        if (value instanceof ServiceClosureArgument) {
            value.values = this._processValue(value.values, 1, 1);
        } else if (value instanceof ArgumentInterface) {
            value.values = this._processValue(value.values, rootLevel, 1 + level);
        } else if (value instanceof Definition) {
            if (value.isSynthetic() || value.isAbstract()) {
                return value;
            }

            value.setArguments(this._processValue(value.getArguments(), 0));
            value.setProperties(this._processValue(value.getProperties(), 1));
            value.setMethodCalls(this._processValue(value.getMethodCalls(), 2));
            value.setShutdownCalls(this._processValue(value.getShutdownCalls(), 3));
        } else if (isArray(value) || isObjectLiteral(value)) {
            const map = HashTable.fromObject(value);

            /** @type {number | boolean} */
            let i = 0;

            for (const [ k, v ] of map) {
                try {
                    if (false !== i && k != i++) {
                        i = false;
                    }

                    const processedValue = this._processValue(v, rootLevel, 1 + level);
                    if (v !== processedValue) {
                        map.put(k, processedValue);
                    }
                } catch (e) {
                    if (! (e instanceof RuntimeException)) {
                        throw e;
                    }

                    if (rootLevel < level || (rootLevel && ! level)) {
                        map.remove(k);
                    } else if (rootLevel) {
                        throw e;
                    } else {
                        map.put(k, null);
                    }
                }
            }

            // Ensure numerically indexed arguments have sequential numeric keys.
            value = false !== i ? Object.values(map.toObject()) : map.toObject();
        } else if (value instanceof Reference) {
            const id = value.toString();
            if (this._container.has(id)) {
                return value;
            }

            const invalidBehavior = value.invalidBehavior;

            // Resolve invalid behavior
            if (Container.NULL_ON_INVALID_REFERENCE === invalidBehavior) {
                value = null;
            } else if (Container.IGNORE_ON_INVALID_REFERENCE === invalidBehavior) {
                if (0 < level || rootLevel) {
                    throw this._signalingException;
                }

                value = null;
            }
        }

        return value;
    }
}
