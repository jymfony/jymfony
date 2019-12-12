const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * This replaces all ChildDefinition instances with their equivalent fully
 * merged Definition instance.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveChildDefinitionsPass extends AbstractRecursivePass {
    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (! (value instanceof Definition)) {
            return super._processValue(value, isRoot);
        }

        if (isRoot) {
            // Yes, we are specifically fetching the definition from the
            // Container to ensure we are not operating on stale data
            value = this._container.getDefinition(this._currentId);
        }

        if (value instanceof ChildDefinition) {
            value = this._resolveDefinition(value);
            if (isRoot) {
                this._container.setDefinition(this._currentId, value);
            }
        }

        return super._processValue(value, isRoot);
    }

    /**
     * Resolves the definition.
     *
     * @param {Jymfony.Component.DependencyInjection.ChildDefinition} definition
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     *
     * @throws {RuntimeException} When the definition is invalid
     */
    _resolveDefinition(definition) {
        try {
            return this._doResolveDefinition(definition);
        } catch (e) {
            if (e instanceof ExceptionInterface) {
                e.message = __jymfony.sprintf('Service "%s": %s', this._currentId, e.message);
            }

            throw e;
        }
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ChildDefinition} definition
     *
     * @returns {Jymfony.Component.DependencyInjection.Definition}
     *
     * @private
     */
    _doResolveDefinition(definition) {
        const parent = definition.getParent();
        if (! this._container.has(parent.toString())) {
            throw new RuntimeException(`The parent definition "${parent.toString()}" defined for definition "${this._currentId}" does not exist.`);
        }

        let parentDef = this._container.findDefinition(parent.toString());
        if (parentDef instanceof ChildDefinition) {
            const id = this._currentId;
            this._currentId = parent;

            parentDef = this._resolveDefinition(parentDef);
            this._container.setDefinition(parent.toString(), parentDef);
            this._currentId = id;
        }

        const compiler = this._container.getCompiler();
        const formatter = compiler.logFormatter;

        compiler.addLogMessage(formatter.formatResolveInheritance(this, this._currentId, parent.toString()));

        const def = new Definition();

        def.setClass(parentDef.getClass());
        def.setMethodCalls(parentDef.getMethodCalls());
        def.setShutdownCalls(parentDef.getShutdownCalls());
        def.setProperties(parentDef.getProperties());

        if (parentDef.isDeprecated()) {
            def.setDeprecated(true, parentDef.getDeprecationMessage('%service_id%'));
        }

        def.setFactory(parentDef.getFactory());
        def.setConfigurator(parentDef.getConfigurator());
        def.setPublic(parentDef.isPublic());
        def.setLazy(parentDef.isLazy());
        def.setChanges(parentDef.getChanges());
        def.setProperties(parentDef.getProperties());

        const parentModule = parentDef.getModule();
        if (parentModule) {
            def.setModule(parentModule[0], parentModule[1]);
        }

        const changes = definition.getChanges();

        if (changes.class) {
            def.setClass(definition.getClass());
        }

        if (changes.factory) {
            def.setFactory(definition.getFactory());
        }

        if (changes.configurator) {
            def.setConfigurator(definition.getConfigurator());
        }

        if (changes.module) {
            def.setModule(definition.getModule()[0], definition.getModule()[1]);
        }

        if (changes['public']) {
            def.setPublic(definition.isPublic());
        }

        if (changes.lazy) {
            def.setLazy(definition.isLazy());
        }

        if (changes.deprecated) {
            def.setDeprecated(definition.isDeprecated(), definition.getDeprecationMessage('%service_id%'));
        }

        if (changes.decorated_service) {
            const decoratedService = definition.getDecoratedService();
            if (! decoratedService) {
                def.setDecoratedService(undefined);
            } else {
                def.setDecoratedService(decoratedService[0], decoratedService[1], decoratedService[2]);
            }
        }

        definition._arguments = parentDef.getArguments();
        for (const argument of definition.getArguments()) {
            def.addArgument(argument);
        }

        for (const [ k, v ] of __jymfony.getEntries(definition.getProperties())) {
            def.addProperty(k, v);
        }

        // Append method calls
        const calls = definition.getMethodCalls();
        if (0 < calls.length) {
            def.setMethodCalls([ ...def.getMethodCalls(), ...calls ]);
        }

        const shutdownCalls = definition.getShutdownCalls();
        if (0 < shutdownCalls.length) {
            def.setShutdownCalls([ ...def.getShutdownCalls(), ...shutdownCalls ]);
        }

        def.setAbstract(definition.isAbstract());
        def.setShared(definition.isShared());
        def.setTags(definition.getTags());
        def.setAutoconfigured(definition.isAutoconfigured());

        return def;
    }
}
