const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const ParameterNotFoundException = Jymfony.DependencyInjection.Exception.ParameterNotFoundException;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ResolveParameterPlaceHoldersPass}
 */
module.exports = class ResolveParameterPlaceHoldersPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        let parameterBag = container.parameterBag;

        for (let [ id, definition ] of __jymfony.getEntries(container.getDefinitions())) {
            try {
                definition.setClass(parameterBag.resolveValue(definition.getClass()));
                definition.setFile(parameterBag.resolveValue(definition.getFile()));
                definition.setArguments(parameterBag.resolveValue(definition.getArguments()));

                let factory = definition.getFactory();
                if (isArray(factory) && factory[0]) {
                    factory[0] = parameterBag.resolveValue(factory[0]);
                    definition.setFactory(factory);
                }

                let calls = definition.getMethodCalls();
                for (let [ key, call ] of __jymfony.getEntries(calls)) {
                    calls[key] = [ parameterBag.resolveValue(call[0]), parameterBag.resolveValue(call[1]) ];
                }
                definition.setMethodCalls(calls);

                definition.setProperties(parameterBag.resolveValue(definition.getProperties()));
            } catch (e) {
                if (e instanceof ParameterNotFoundException) {
                    e.sourceId = id;
                }

                throw e;
            }
        }

        let aliases = {};
        for (let [ name, target ] of __jymfony.getEntries(container.getAliases())) {
            aliases[parameterBag.resolveValue(name)] = parameterBag.resolveValue(target);
        }
        container.setAliases(aliases);

        parameterBag.resolve();
    }
};
