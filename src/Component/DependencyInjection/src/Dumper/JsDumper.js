const EnvVariableResource = Jymfony.Component.Config.Resource.EnvVariableResource;
const ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;
const ServiceClosureArgument = Jymfony.Component.DependencyInjection.Argument.ServiceClosureArgument;
const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;
const ServiceCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ServiceCircularReferenceException;
const Parameter = Jymfony.Component.DependencyInjection.Parameter;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const Variable = Jymfony.Component.DependencyInjection.Variable;

const firstChars = 'abcdefghijklmnopqrstuvwxyz';
const nonFirstChars = 'abcdefghijklmnopqrstuvwxyz0123456789_';

/**
 * Dumps container in a js class.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Dumper
 * @type {Jymfony.Component.DependencyInjection.Dumper.JsDumper}
 */
class JsDumper {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    __construct(container) {
        if (! container.frozen) {
            throw new RuntimeException('Cannot dump an uncompiled container. Please call compile() on your builder first');
        }

        this._container = container;
        this._inlinedDefinitions = new Map;
    }

    /**
     * Dumps the service container.
     *
     * Available options:
     *  * class_name: The class name [default: ProjectContainer]
     *  * base_class: The base class name [default: Jymfony.Component.DependencyInjection.Container]
     *
     * @param {Object<string, *>} options
     *
     * @returns {string}
     */
    dump(options = {}) {
        options = Object.assign({}, {
            base_class: 'Jymfony.Component.DependencyInjection.Container',
            class_name: 'ProjectContainer',
        }, options);

        this._initMethodNamesMap(options.base_class);

        let code = this._startClass(options.class_name, options.base_class);
        code += this._getServices();
        code += this._getDefaultParametersMethod();
        code += this._endClass(options.class_name);

        return code;
    }

    _initMethodNamesMap(baseClass) {
        this._serviceIdToMethodNameMap = new Map;
        this._usedMethodNames = new Set;

        try {
            let reflectionClass = new ReflectionClass(baseClass);
            for (let method of reflectionClass.methods) {
                this._usedMethodNames.add(method);
            }
        } catch (e) {
            // Do nothing
        }
    }

    _startClass(className, baseClass) {
        return `const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;

class ${className} extends ${baseClass} {
    constructor() {
        super(new FrozenParameterBag(${className}._getDefaultsParameters()));

        ${this._getMethodMap()}
        ${this._getAliases()}
        this._privates = {};
    }

    compile() {
        throw new LogicException('You cannot compile a dumped container');
    }

    get frozen() {
        return true;
    }
`;
    }

    _endClass(className) {
        return `
}

module.exports = global.${className} = ${className};
`;
    }

    _getMethodMap() {
        let code = `this._methodMap = {
`;

        let definitions = this._container.getDefinitions();
        let ids = Object.keys(definitions).sort();
        for (let id of ids) {
            let definition = definitions[id];
            if (! definition.isPublic() || definition.isSynthetic()) {
                continue;
            }

            code += '            ' + this._export(id) + ': ' + this._export(this._generateMethodName(id)) + ",\n";
        }

        return code + "        };\n";
    }

    _getAliases() {
        let code = `this._aliases = {
`;

        let aliases = this._container.getAliases();
        let ids = Object.keys(aliases).sort();
        for (let alias of ids) {
            let id = aliases[alias].toString();
            while (undefined !== aliases[id]) {
                id = aliases[id].toString();
            }

            code += '            ' + this._export(alias) + ': ' + this._export(id) + ",\n";
        }

        return code + "        };\n";
    }

    _export(value) {
        if (isScalar(value) || isArray(value) || isObjectLiteral(value)) {
            return JSON.stringify(value);
        }

        if (undefined === value) {
            return 'undefined';
        }

        if (null === value) {
            return 'null';
        }

        throw new Error('Unimplemented exporting value "' + value + '"');
    }

    _generateMethodName(id) {
        if (this._serviceIdToMethodNameMap[id]) {
            return this._serviceIdToMethodNameMap[id];
        }

        let name = Container.camelize(id);
        name = name.replace(/[^a-zA-Z0-9_\x7f-\xff]/g, '');

        let methodName = `get${name}Service`;
        let suffix = 1;

        while (this._usedMethodNames.has(methodName)) {
            ++suffix;
            methodName = `get${name}${suffix}Service`;
        }

        this._serviceIdToMethodNameMap[id] = methodName;
        this._usedMethodNames.add(methodName);

        return methodName;
    }

    _getServices() {
        let publicServices = '', privateServices = '';
        let serviceIds = Object.keys(this._container.getDefinitions()).sort();
        for (let id of serviceIds) {
            let definition = this._container.getDefinition(id);
            if (definition.isPublic()) {
                publicServices += this._getService(id, definition);
            } else {
                privateServices += this._getService(id, definition);
            }
        }

        return publicServices + privateServices;
    }

    _getDefaultParametersMethod() {
        let code = "{\n";
        let parameters = this._container.parameterBag.all();
        for (let key of Object.keys(parameters)) {
            code += `            "${key}": ${this._dumpParameter(key)},` + "\n";
        }
        code += '        }';

        return `
    static _getDefaultsParameters() {
        return ${code};
    }`;
    }

    /**
     * Generate a service
     *
     * @param {string} id
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     *
     * @private
     */
    _getService(id, definition) {
        if (definition.isSynthetic()) {
            return '';
        }

        this._definitionVariables = new Map();
        this._referenceVariables = {};
        this._variableCount = 0;

        let class_;
        let returns = [];

        if (definition.isSynthetic()) {
            returns.push('@throws {Jymfony.Component.DependencyInjection.RuntimeException} always since this service is expected to be injected dynamically');
        } else if (class_ = definition.getClass()) {
            returns.push('@returns {' + (-1 != class_.indexOf('%') ? '*' : class_) + '}');
        } else if (definition.getFactory()) {
            returns.push('@returns {Object}');
        }

        if (definition.isDeprecated()) {
            returns.push('@deprecated ' + definition.getDeprecationMessage(id));
        }

        returns = returns.join('\n     * ').replace(/\n     * \n/g, '\n     *\n');

        let doc = '', visibility = '', shared = '';

        if (definition.isShared()) {
            shared = 'shared ';
        }

        if (definition.isPublic()) {
            visibility = 'public ';
        }

        let lazyInitialization = '';
        if (definition.isLazy()) {
            doc = '     * @param {boolean} lazyLoad Whether to try to lazy-load this service' + doc;
            lazyInitialization = 'lazyLoad = true';
        }

        if (doc.length) {
            doc += '\n';
        }

        let methodName = this._generateMethodName(id);
        return `
    /**
     * Gets the ${visibility}'${id}' ${shared}service.
     *
${doc}     * ${returns}
     */
    ${methodName}(${lazyInitialization}) {
${this._addServiceInclude(id, definition)}\
${this._addLocalTempVariables(id, definition)}\
${this._addInlinedDefinitions(id, definition)}\
${this._addServiceInstance(id, definition)}\
${this._addInlinedDefinitionsSetup(id, definition)}\
${this._addProperties(id, definition)}\
${this._addMethodCalls(id, definition)}\
${this._addConfigurator(id, definition)}\
${this._addReturn(id, definition)}\
    }
`;
    }

    _addServiceInclude(id, definition) {
        let template = '        require(%s);\n';
        let code = '';

        let file;
        if (file = definition.getFile()) {
            code += __jymfony.sprintf(template, this._dumpValue(file));
        }

        for (let def of this._getInlinedDefinitions(definition)) {
            file = def.getFile();
            if (file) {
                code += __jymfony.sprintf(template, this._dumpValue(file));
            }
        }

        return code;
    }

    _addLocalTempVariables(cId, definition) {
        let template = '        let %s = %s;\n';

        let localDefinitions = [ definition, ...this._getInlinedDefinitions(definition) ];

        let calls = {};
        let behavior = {};

        for (let iDefinition of localDefinitions) {
            this._getServiceCallsFromArguments(iDefinition.getArguments(), calls, behavior);
            this._getServiceCallsFromArguments(iDefinition.getMethodCalls(), calls, behavior);
            this._getServiceCallsFromArguments(iDefinition.getProperties(), calls, behavior);
            this._getServiceCallsFromArguments([ iDefinition.getConfigurator() ], calls, behavior);
            this._getServiceCallsFromArguments([ iDefinition.getFactory() ], calls, behavior);
        }

        let code = '';
        for (let [ id, callCount ] of __jymfony.getEntries(calls)) {
            if ('service_container' === id || id === cId) {
                continue;
            }

            if (1 < callCount) {
                let name = this._getNextVariableName();
                this._referenceVariables[id] = new Variable(name);

                if (Container.EXCEPTION_ON_INVALID_REFERENCE === behavior[id]) {
                    code += __jymfony.sprintf(template, name, this._getServiceCall(id));
                } else {
                    code += __jymfony.sprintf(template, name, this._getServiceCall(id, new Reference(id, Container.NULL_ON_INVALID_REFERENCE)));
                }
            }
        }

        if ('' !== code) {
            code += "\n";
        }

        return code;
    }

    _addInlinedDefinitions(id, definition) {
        let code = '';
        let nbOccurrences = new Map();
        let processed = new Set();
        let inlinedDefinitions = this._getInlinedDefinitions(definition);

        for (let iDefinition of inlinedDefinitions) {
            if (! nbOccurrences.has(iDefinition)) {
                nbOccurrences.set(iDefinition, 1);
            } else {
                let i = nbOccurrences.get(iDefinition);
                nbOccurrences.set(iDefinition, i + 1);
            }
        }

        for (let sDefinition of inlinedDefinitions) {
            if (processed.has(sDefinition)) {
                continue;
            }
            processed.add(sDefinition);

            if (1 < nbOccurrences.get(sDefinition) || sDefinition.getMethodCalls().length || sDefinition.getProperties().length || sDefinition.getConfigurator()) {
                let name = this._getNextVariableName();
                this._definitionVariables.set(sDefinition, new Variable(name));

                if (this._hasReference(id, sDefinition.getArguments())) {
                    throw new ServiceCircularReferenceException(id, [ id ]);
                }

                code += this._addNewInstance(sDefinition, name, ' = ', id);

                if (! this._hasReference(id, sDefinition.getMethodCalls(), true) && ! this._hasReference(id, sDefinition.getProperties(), true)) {
                    code += this._addProperties(undefined, sDefinition, name);
                    code += this._addMethodCalls(undefined, sDefinition, name);
                    code += this._addConfigurator(undefined, sDefinition, name);
                }

                code += '\n';
            }
        }

        return code;
    }

    /**
     * Generate service instance
     *
     * @param {string} id
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     *
     * @returns {string}
     * @private
     */
    _addServiceInstance(id, definition) {
        let simple = this._isSimpleInstance(id, definition);
        let instantiation = '';
        if (definition.isShared()) {
            let variable = definition.isPublic() ? '_services' : '_privates';
            instantiation = `this.${variable}["${id}"] = ` + (simple ? '' : 'instance');
        } else {
            instantiation = 'instance = ';
        }

        let ret = '';
        if (simple) {
            ret = 'return ';
        } else {
            instantiation += ' = ';
        }

        let code = this._addNewInstance(definition, ret, instantiation, id);
        if (! definition.isShared() || ! simple) {
            code = '        let instance;\n' + code;
        }

        if (! simple) {
            code += "\n";
        }

        return code;
    }

    _addInlinedDefinitionsSetup(id, definition) {
        this._referenceVariables[id] = 'instance';
        let code = '';
        let processed = new Set();

        for (let iDefinition of this._getInlinedDefinitions(definition)) {
            if (processed.has(iDefinition)) {
                continue;
            }

            processed.add(iDefinition);

            if (! this._hasReference(id, iDefinition.getMethodCalls(), true) && ! this._hasReference(id, iDefinition.getProperties(), true)) {
                continue;
            }

            // If the instance is simple, the return statement has already been generated
            // So, the only possible way to get there is because of a circular reference
            if (this._isSimpleInstance(id, definition)) {
                throw new ServiceCircularReferenceException(id, array(id));
            }

            let name = this._definitionVariables.get(iDefinition);
            code += this._addMethodCalls(null, iDefinition, name);
            code += this._addProperties(null, iDefinition, name);
            code += this._addConfigurator(null, iDefinition, name);
        }

        if ('' !== code) {
            code += "\n";
        }

        return code;
    }

    _addProperties(id, definition, variableName = 'instance') {
        let code = '';
        for (let [ name, value ] of __jymfony.getEntries(definition.getProperties())) {
            code += __jymfony.sprintf('        %s.%s = %s;\n', variableName, name, this._dumpValue(value));
        }

        return code;
    }

    _addMethodCalls(id, definition, variableName = 'instance') {
        let code = '';

        for (let call of definition.getMethodCalls()) {
            let args = [];
            for (let value of call[1]) {
                args.push(this._dumpValue(value));
            }

            code += this._wrapServiceConditionals(call[1], __jymfony.sprintf('        %s.%s(%s);\n', variableName, call[0], args.join(', ')));
        }

        return code;
    }

    _addConfigurator(id, definition, variableName = 'instance') {
        let callable = definition.getConfigurator();
        if (! callable) {
            return '';
        }

        if (isArray(callable)) {
            if (callable[0] instanceof Reference || (callable[0] instanceof Definition && this._definitionVariables.has(definition))) {
                return __jymfony.sprintf("        %s.%s(%s);\n", this._dumpValue(callable[0]), callable[1], variableName);
            }

            let class_ = this._dumpValue(callable[0]);
            throw new RuntimeException(class_);
        }

        return __jymfony.sprintf('        %s(%s);\n', callable, variableName);
    }

    _addReturn(id, definition) {
        if (this._isSimpleInstance(id, definition)) {
            return '';
        }

        return '        return instance;\n';
    }

    _dumpValue(value, interpolate = true) {
        if (value instanceof ArgumentInterface) {
            let scope = [ this._definitionVariables, this._referenceVariables, this._variableCount ];
            this._definitionVariables = this._referenceVariables = undefined;

            try {
                if (value instanceof ServiceClosureArgument) {
                    value = value.values[0];
                    let code = this._dumpValue(value, interpolate);

                    return __jymfony.sprintf("(function () {\n            return %s;\n        )()", code);
                }
            } finally {
                [ this._definitionVariables, this._referenceVariables, this._variableCount ] = scope;
            }
        } else if (value instanceof Definition) {
            if (this._definitionVariables && this._definitionVariables.has(value)) {
                return this._dumpValue(this._definitionVariables.get(value), interpolate);
            }

            if (0 < value.getMethodCalls().length) {
                throw new RuntimeException('Cannot dump definitions which have method calls');
            }

            if (value.getConfigurator()) {
                throw new RuntimeException('Cannot dump definitions which have configurator');
            }

            let args = [];
            for (let argument of value.getArguments()) {
                args.push(this._dumpValue(argument));
            }

            let factory = value.getFactory();
            if (factory) {
                if (isString(factory)) {
                    return __jymfony.sprintf('%s(%s)', this._dumpLiteralClass(this._dumpValue(factory)), args.join(', '));
                }

                if (isArray(factory)) {
                    if (isString(factory[0])) {
                        return __jymfony.sprintf('%s.%s(%s)', this._dumpLiteralClass(this._dumpValue(factory[0])), factory[1], args.join(', '));
                    }

                    if (factory[0] instanceof Definition) {
                        return __jymfony.sprintf('getCallableFromArray(%s, \'%s\')(%s)', this._dumpValue(factory[0]), factory[1], args.join(', '));
                    }

                    if (factory[0] instanceof Reference) {
                        return __jymfony.sprintf('%s.%s(%s)', this._dumpValue(factory[0]), factory[1], args.join(', '));
                    }
                }

                throw new RuntimeException('Cannot dump definition because of invalid factory');
            }

            let class_ = value.getClass();
            if (! class_) {
                throw new RuntimeException('Cannot dump definition which have no class nor factory');
            }

            return __jymfony.sprintf('new %s(%s)', this._dumpLiteralClass(this._dumpValue(class_)), args.join(', '));
        } else if (value instanceof Variable) {
            return value.toString();
        } else if (value instanceof Reference) {
            let id = value.toString();
            if (this._referenceVariables && this._referenceVariables[id]) {
                return this._dumpValue(this._referenceVariables[id], interpolate);
            }

            return this._getServiceCall(id, value);
        } else if (value instanceof Parameter) {
            return this._dumpParameter(value.toString());
        } else if (interpolate && isString(value)) {
            let match;
            if (match = /^%([^%]+)%$/.exec(value)) {
                return this._dumpParameter(match[1].toLowerCase());
            }

            let replaceParameters = (match, p1, p2) => {
                return "'+" + this._dumpParameter(p2.toLowerCase()) + "+'";
            };

            return this._export(value).replace(/(%)?(%)([^%]+)\1/g, replaceParameters).replace(/%%/g, '%');
        } else if (isArray(value) || isObjectLiteral(value)) {
            let code = [];
            for (let [ k, v ] of __jymfony.getEntries(value)) {
                code.push((isArray(value) ? '' : this._dumpValue(k, interpolate) + ': ') + this._dumpValue(v));
            }

            return __jymfony.sprintf(isArray(value) ? '[%s]' : '{%s}', code.join(', '));
        } else if (isObject(value)) {
            throw new RuntimeException('Unable to dump a service container if a parameter is an object');
        } else if (null === value || undefined === value) {
            return this._export(value);
        }

        return value;
    }

    _getInlinedDefinitions(definition) {
        if (! this._inlinedDefinitions.has(definition)) {
            let definitions = [
                ...this._getDefinitionsFromArguments(definition.getArguments()),
                ...this._getDefinitionsFromArguments(definition.getMethodCalls()),
                ...this._getDefinitionsFromArguments(definition.getProperties()),
                ...this._getDefinitionsFromArguments([ definition.getConfigurator() ]),
                ...this._getDefinitionsFromArguments([ definition.getFactory() ]),
            ];

            this._inlinedDefinitions.set(definition, definitions);
        }

        return this._inlinedDefinitions.get(definition);
    }

    * _getDefinitionsFromArguments(args) {
        for (let argument of Object.values(args)) {
            if (argument instanceof Definition) {
                yield * this._getInlinedDefinitions(argument);
                yield argument;
            } else if (isArray(argument) || isObjectLiteral(argument)) {
                yield * this._getDefinitionsFromArguments(argument);
            }
        }
    }

    /**
     * Dumps a parameter.
     *
     * @param {string} name
     *
     * @returns {string}
     *
     * @private
     */
    _dumpParameter(name) {
        if ('env()' !== name && 'env(' === name.substr(0, 4) && ')' === name.substr(-1, 1)) {
            let matches = /env\((.+)\)/.exec(name);
            let envVarName = matches[1];

            this._container.addResource(new EnvVariableResource(envVarName));
        }

        let parameter = this._container.getParameter(name);
        if (parameter instanceof Reference) {
            throw new InvalidArgumentException(__jymfony.sprintf('You cannot dump a container with parameters that contain references to other services (reference to service "%s" found in "%s").', parameter.toString(), name));
        } else if (parameter instanceof Definition) {
            throw new InvalidArgumentException(__jymfony.sprintf('You cannot dump a container with parameters that contain service definitions. Definition for "%s" found in "%s".', parameter.getClass(), name));
        } else if (parameter instanceof Variable) {
            throw new InvalidArgumentException(__jymfony.sprintf('You cannot dump a container with parameters that contain variable references. Variable "%s" found in "%s".', parameter.toString(), name));
        }

        return this._export(parameter, false);
    }

    _getServiceCall(id, reference = undefined) {
        if ('service_container' === id) {
            return 'this';
        }

        if (this._container.hasDefinition(id)) {
            let definition = this._container.getDefinition(id);
            if (definition.isPublic()) {
                return '(this._services[' + this._dumpValue(id) + '] || this.' + this._generateMethodName(id) + '())';
            }

            return '(this._privates[' + this._dumpValue(id) + '] || this.' + this._generateMethodName(id) + '())';
        }

        if (reference && Container.EXCEPTION_ON_INVALID_REFERENCE !== reference.invalidBehavior) {
            return __jymfony.sprintf('this.get(%s, Container.NULL_ON_INVALID_REFERENCE)', this._export(id));
        }

        if (this._container.hasAlias(id)) {
            id = this._container.getAlias(id).toString();
        }

        return __jymfony.sprintf('this.get(%s)', this._export(id));
    }

    _dumpLiteralClass(class_) {
        if ('"' !== class_.charAt(0)) {
            throw new RuntimeException('Invalid class name');
        }

        return class_.substring(1, class_.length-1);
    }

    _getServiceCallsFromArguments(args, calls, behavior) {
        for (let argument of Object.values(args)) {
            if (argument instanceof Reference) {
                let id = argument.toString();

                if (! calls[id]) {
                    calls[id] = 0;
                }

                if (! behavior[id]) {
                    behavior[id] = argument.invalidBehavior;
                } else if (Container.EXCEPTION_ON_INVALID_REFERENCE !== behavior[id]) {
                    behavior[id] = argument.invalidBehavior;
                }

                ++calls[id];
            } else if (isArray(argument) || isObjectLiteral(argument)) {
                this._getServiceCallsFromArguments(argument, calls, behavior);
            }
        }
    }

    _isSimpleInstance(id, definition) {
        for (let sDefinition of [ definition, ...this._getInlinedDefinitions(definition) ]) {
            if (definition !== sDefinition && ! this._hasReference(id, sDefinition.getMethodCalls())) {
                continue;
            }

            if (0 < sDefinition.getMethodCalls().length || 0 < Object.keys(sDefinition.getProperties()).length || sDefinition.getConfigurator()) {
                return false;
            }
        }

        return true;
    }

    _addNewInstance(definition, ret, instantiation, id) {
        let class_ = this._dumpValue(definition.getClass());
        let args = Array.from(definition.getArguments().map(T => this._dumpValue(T)));

        if (definition.getFactory()) {
            let callable = definition.getFactory();
            if (isArray(callable)) {
                if (callable[0] instanceof Reference || (callable[0] instanceof Definition && this._definitionVariables.has(callable[0]))) {
                    return __jymfony.sprintf(`        ${ret}${instantiation}%s.%s(%s);\n`, this._dumpValue(callable[0]), callable[1], args.join(', '));
                }

                class_ = this._dumpValue(callable[0]);
                if ('"' === class_.charAt(0)) {
                    return __jymfony.sprintf(`        ${ret}${instantiation}%s.%s(%s);\n`, this._dumpLiteralClass(class_), callable[1], args.join(', '));
                }

                if (0 === class_.indexOf('new ')) {
                    return __jymfony.sprintf(`        ${ret}${instantiation}(%s).%s(%s);\n`, class_, callable[1], args.join(', '));
                }

                return __jymfony.sprintf(`        ${ret}${instantiation}getCallableFromArray(%s, %s)(%s);\n`, class_, this._export(callable[1]), args.join(', '));
            }

            return __jymfony.sprintf(`        ${ret}${instantiation}%s(%s);\n`, this._dumpLiteralClass(this._dumpValue(callable)), args.join(', '));
        }

        return __jymfony.sprintf(`        ${ret}${instantiation}new %s(%s);\n`, this._dumpLiteralClass(class_), args.join(', '));
    }

    _getNextVariableName() {
        let name = '';
        let i = this._variableCount;

        if ('' === name) {
            name += firstChars[i % firstChars.length];
            i /= firstChars.length;
        }

        while (0 < i) {
            --i;
            name += nonFirstChars[i % nonFirstChars.length];
            i /= nonFirstChars.length;
        }

        ++this._variableCount;
        return '$' + name;
    }

    _hasReference(id, args, deep = false, visited = new Set()) {
        for (let argument of args) {
            if (argument instanceof Reference) {
                let argumentId = argument.toString();
                if (id === argumentId) {
                    return true;
                }

                if (deep && ! visited.has(argumentId) && 'service_container' !== argumentId) {
                    visited.add(argumentId);
                    let service = this._container.getDefinition(argumentId);

                    // Todo
                    // If (service.isLazy() && ! (this._getProxyDumper instanceof NullDumper))

                    args = [ ...service.getMethodCalls(), ...service.getArguments(), ...service.getProperties() ];
                    if (this._hasReference(id, args, deep, visited)) {
                        return true;
                    }
                }
            } else if (isArray(argument) || isObjectLiteral(argument)) {
                if (this._hasReference(id, argument, deep, visited)) {
                    return true;
                }
            }
        }

        return false;
    }

    _wrapServiceConditionals(value, code) {
        let conditionals = ContainerBuilder.getServiceConditionals(value);
        if (! conditionals.length) {
            return code;
        }

        let conditions = [];
        for (let service of conditionals) {
            conditions.push(__jymfony.sprintf('this.has(%s)', this._export(service.toString())));
        }

        code = code.split('\n').map(T => T ? '    '+T : T).join('\n');
        return __jymfony.sprintf('        if (%s) {\n%s        }\n', conditions.join(' && '), code);
    }
}

module.exports = JsDumper;
