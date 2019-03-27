const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const Container = Jymfony.Component.DependencyInjection.Container;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class ResolveInvalidReferencesPass extends implementationOf(CompilerPassInterface) {
    __construct() {
        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @private
         */
        this._container = undefined;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        this._container = container;

        for (const definition of Object.values(container.getDefinitions())) {
            if (definition.isSynthetic() || definition.isAbstract()) {
                continue;
            }

            definition.setArguments(this._processArguments(definition.getArguments()));

            const calls = [];
            for (const call of definition.getMethodCalls()) {
                try {
                    calls.push([ call[0], this._processArguments(call[1], true) ]);
                } catch (e) {
                    // Call is removed
                }
            }

            definition.setMethodCalls(calls);

            const shutdownCalls = [];
            for (const call of definition.getShutdownCalls()) {
                try {
                    shutdownCalls.push([ call[0], this._processArguments(call[1], true) ]);
                } catch (e) {
                    // Call is removed
                }
            }

            definition.setShutdownCalls(shutdownCalls);

            const properties = {};
            for (let [ name, value ] of __jymfony.getEntries(definition.getProperties())) {
                try {
                    value = this._processArguments([ value ], true);
                    properties[name] = value[0];
                } catch (e) {
                    // Property ignored
                }
            }

            definition.setProperties(properties);
        }
    }

    _processArguments(args, inMethodCall, inCollection = undefined) {
        for (const [ k, argument ] of __jymfony.getEntries(args)) {
            if (isArray(argument) || isObjectLiteral(argument)) {
                args[k] = this._processArguments(argument, inMethodCall, true);
            } else if (argument instanceof Reference) {
                const id = argument.toString();
                const invalidBehavior = argument.invalidBehavior;
                const exists = this._container.has(id);

                if (!exists && invalidBehavior === Container.NULL_ON_INVALID_REFERENCE) {
                    args[k] = null;
                } else if (!exists && invalidBehavior === Container.IGNORE_ON_INVALID_REFERENCE) {
                    if (inCollection) {
                        if (isArray(args)) {
                            args.splice(k, 1);
                        } else {
                            delete args[k];
                        }
                        continue;
                    }

                    if (inMethodCall) {
                        throw new RuntimeException('Method shouldn\'t be called.');
                    }

                    args[k] = null;
                }
            }
        }

        return args;
    }
}

module.exports = ResolveInvalidReferencesPass;
