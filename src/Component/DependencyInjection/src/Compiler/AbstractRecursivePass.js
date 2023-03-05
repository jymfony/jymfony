const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 *
 * @abstract
 */
export default class AbstractRecursivePass extends implementationOf(CompilerPassInterface) {
    __construct() {
        /**
         * @type {string}
         *
         * @protected
         */
        this._currentId = undefined;

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @protected
         */
        this._container = undefined;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        this._currentId = undefined;
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
     * @param {boolean} [isRoot = false]
     *
     * @returns {*} The processed value
     *
     * @protected
     */
    _processValue(value, isRoot = false) {
        if (isArray(value) || isObjectLiteral(value)) {
            for (const [ k, v ] of __jymfony.getEntries(value)) {
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
            value.setShutdownCalls(this._processValue(value.getShutdownCalls()));

            const changes = value.getChanges();
            if (changes['factory']) {
                value.setFactory(this._processValue(value.getFactory()));
            }
            if (changes['configurator']) {
                value.setConfigurator(this._processValue(value.getConfigurator()));
            }
        }

        return value;
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     * @param {boolean} required
     *
     * @returns {ReflectionMethod | null}
     *
     * @throws {RuntimeException}
     * @protected
     */
    _getConstructor(definition, required) {
        if (definition.isSynthetic() || this._container) {
            return null;
        }

        let klass, method;
        const factory = definition.getFactory();
        if (isArray(factory)) {
            [ klass, method ] = factory;

            if ('__construct' === method || 'constructor' === method) {
                throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": "__construct()" cannot be used as a factory method.', this._currentId));
            }

            if (klass instanceof Reference) {
                let factoryDefinition = this._container.findDefinition(klass.toString());
                while ((null === (klass = factoryDefinition.getClass())) && factoryDefinition instanceof ChildDefinition) {
                    factoryDefinition = this._container.findDefinition(factoryDefinition.getParent());
                }
            } else if (klass instanceof Definition) {
                klass = klass.getClass();
            } else {
                klass = klass || definition.getClass();
            }

            return this._getReflectionMethod(new Definition(klass), method);
        }

        while ((null === (klass = definition.getClass())) && definition instanceof ChildDefinition) {
            definition = this._container.findDefinition(definition.getParent());
        }

        /**
         * @type {ReflectionClass} r
         */
        let r;
        try {
            r = this._container.getReflectionClass(klass);
            if (null === r) {
                if (null === klass) {
                    throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": the class is not set.', this._currentId));
                }

                throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": class "%s" does not exist.', this._currentId, klass));
            }
        } catch (e) {
            if (e instanceof ReflectionException) {
                throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": ', this._currentId) + (e.message[0].toLowerCase() + e.message.substring(1)));
            }

            throw e;
        }

        r = r.constructorMethod;
        if (null === r) {
            if (required) {
                throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": class%s has no constructor.', this._currentId, __jymfony.sprintf(klass !== this._currentId ? ' "%s"' : '', klass)));
            }
        }

        return r;
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     * @param {string} method
     *
     * @throws RuntimeException
     *
     * @returns {ReflectionMethod}
     */
    _getReflectionMethod(definition, method) {
        if ('__construct' === method || 'constructor' === method) {
            return this._getConstructor(definition, true);
        }

        let klass;
        while ((null === (klass = definition.getClass())) && definition instanceof ChildDefinition) {
            definition = this._container.findDefinition(definition.getParent());
        }

        if (null === klass) {
            throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": the class is not set.', this._currentId));
        }

        const r = this._container.getReflectionClass(klass);
        if (null === r) {
            throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": class "%s" does not exist.', this._currentId, klass));
        }

        if (!r.hasMethod(method)) {
            throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": method "%s()" does not exist.', this._currentId, klass !== this._currentId ? klass + '.' + method : method));
        }

        return r.getMethod(method);
    }
}
