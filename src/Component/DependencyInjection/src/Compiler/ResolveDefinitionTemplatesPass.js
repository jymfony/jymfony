const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const Definition = Jymfony.DependencyInjection.Definition;
const DefinitionDecorator = Jymfony.DependencyInjection.DefinitionDecorator;

/**
 * This replaces all DefinitionDecorator instances with their equivalent fully
 * merged Definition instance.
 *
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ResolveDefinitionTemplatesPass}
 */
module.exports = class ResolveDefinitionTemplatesPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritDoc
     */
    process(container) {
        this._compiler = container.getCompiler();
        this._formatter = this._compiler.logFormatter;

        container.setDefinitions(this._resolveArguments(container, container.getDefinitions(), true));
    }

    /**
     * Resolves definition decorator args.
     *
     * @param {Jymfony.DependencyInjection.ContainerBuilder} container The ContainerBuilder
     * @param {Object|Array} args An array of args
     * @param {boolean} isRoot If we are processing the root definitions or not
     *
     * @returns {Object|Array}
     */
    _resolveArguments(container, args, isRoot = false) {
        for (let [ k, argument ] of __jymfony.getEntries(args)) {
            if (isRoot) {
                // Yes, we are specifically fetching the definition from the
                // Container to ensure we are not operating on stale data
                args[k] = argument = container.getDefinition(k);
                this._currentId = k;
            }

            if (isArray(argument) || isObjectLiteral(argument)) {
                args[k] = this._resolveArguments(container, argument);
            } else if (argument instanceof Definition) {
                if (argument instanceof DefinitionDecorator) {
                    args[k] = argument = this._resolveDefinition(container, argument);
                    if (isRoot) {
                        container.setDefinition(k, argument);
                    }
                }

                argument.setArguments(this._resolveArguments(container, argument.getArguments()));
                argument.setMethodCalls(this._resolveArguments(container, argument.getMethodCalls()));
                argument.setProperties(this._resolveArguments(container, argument.getProperties()));

                let configurator = this._resolveArguments(container, [ argument.getConfigurator() ]);
                argument.setConfigurator(configurator[0]);

                let factory = this._resolveArguments(container, [ argument.getFactory() ]);
                argument.setFactory(factory[0]);
            }
        }

        return args;
    }

    /**
     * Resolves the definition.
     *
     * @param {Jymfony.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.DependencyInjection.DefinitionDecorator} definition
     *
     * @returns {Jymfony.DependencyInjection.Definition}
     *
     * @throws {RuntimeException} When the definition is invalid
     */
    _resolveDefinition(container, definition) {
        let parent = definition.getParent();
        if (! container.has(parent.toString())) {
            throw new RuntimeException(`The parent definition "${parent.toString()}" defined for definition "${this._currentId} does not exist.`);
        }

        let parentDef = container.findDefinition(parent.toString());
        if (parentDef instanceof DefinitionDecorator) {
            let id = this._currentId;
            this._currentId = parent;

            parentDef = this._resolveDefinition(container, parentDef.toString());
            container.setDefinition(parent.toString(), parentDef);
            this._currentId = id;
        }

        this._compiler.addLogMessage(this._formatter.formatResolveInheritance(this, this._currentId, parent.toString()));
        let def = new Definition();

        def.setClass(parentDef.getClass());
        def.setArguments(parentDef.getArguments());
        def.setMethodCalls(parentDef.getMethodCalls());
        def.setProperties(parentDef.getProperties());

        if (parentDef.isDeprecated()) {
            def.setDeprecated(true, parentDef.getDeprecationMessage('%service_id%'));
        }

        def.setFactory(parentDef.getFactory());
        def.setConfigurator(parentDef.getConfigurator());
        def.setFile(parentDef.getFile());
        def.setPublic(parentDef.isPublic());
        def.setLazy(parentDef.isLazy());

        let changes = definition.getChanges();
        if (changes.class) {
            def.setClass(definition.getClass());
        }

        if (changes.factory) {
            def.setFactory(definition.getFactory());
        }

        if (changes.configurator) {
            def.setConfigurator(definition.getConfigurator());
        }

        if (changes.file) {
            def.setFile(definition.getFile());
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
            let decoratedService = definition.getDecoratedService();
            if (! decoratedService) {
                def.setDecoratedService(undefined);
            } else {
                def.setDecoratedService(decoratedService[0], decoratedService[1], decoratedService[2]);
            }
        }

        for (let argument of definition.getArguments()) {
            def.addArgument(argument);
        }

        for (let [ k, v ] of __jymfony.getEntries(definition.getProperties())) {
            def.addProperty(k, v);
        }

        // Append method calls
        let calls = definition.getMethodCalls();
        if (0 < calls.length) {
            def.setMethodCalls([ ...def.getMethodCalls(), ...calls ]);
        }

        def.setAbstract(definition.isAbstract());
        def.setShared(definition.isShared());
        def.setTags(definition.getTags());

        return def;
    }
};
