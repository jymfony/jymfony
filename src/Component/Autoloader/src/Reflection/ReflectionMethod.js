const { Generator: SourceMapGenerator } = require('@jymfony/compiler/src/SourceMap');
const ReflectionParameter = require('./ReflectionParameter');
const ReflectorTrait = require('./ReflectorTrait');
const vm = require('vm');

/**
 * Reflection utility for class method.
 */
class ReflectionMethod extends implementationOf(ReflectorInterface, ReflectorTrait) {
    /**
     * Constructor.
     *
     * @param {ReflectionClass} reflectionClass
     * @param {string} methodName
     */
    constructor(reflectionClass, methodName) {
        super();

        /**
         * @type {string}
         *
         * @private
         */
        this._name = methodName;

        const method = reflectionClass._methods[methodName];
        if (undefined === method) {
            throw new ReflectionException('Unknown method "' + methodName + '\'');
        }

        /**
         * @type {boolean}
         *
         * @private
         */
        this._private = method.private;

        /**
         * @type {Function}
         *
         * @private
         */
        this._method = method.value;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = method.static;

        /**
         * @type {ReflectionClass}
         *
         * @private
         */
        this._class = new ReflectionClass(method.ownClass);

        /**
         * @type {string}
         *
         * @private
         */
        this._type = isGeneratorFunction(this._method) ? ReflectionMethod.GENERATOR : ReflectionMethod.FUNCTION;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._async = isAsyncFunction(this._method);

        /**
         * @type {ReflectionParameter[]}
         *
         * @private
         */
        this._parameters = [];
        if (method.parameters !== undefined) {
            this._parameters = method.parameters.map(p => new ReflectionParameter(this, p.name, p.index, p.default, p.objectPattern, p.arrayPattern, p.restElement));
        } else {
            this._parseParameters();
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._docblock = this._method[Symbol.docblock];
    }

    /**
     * Invokes the method.
     *
     * @param {*} object
     * @param {*[]} args
     *
     * @returns {*}
     */
    invoke(object, ...args) {
        return this._method.call(object, ...args);
    }

    /**
     * Gets the reflection class.
     *
     * @returns {ReflectionClass}
     */
    get reflectionClass() {
        return this._class;
    }

    /**
     * Gets the method name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets if this method is static.
     *
     * @returns {boolean}
     */
    get isStatic() {
        return this._static;
    }

    /**
     * If this method is private.
     *
     * @returns {boolean}
     */
    get isPrivate() {
        return this._private;
    }

    /**
     * Gets if the function is a generator.
     *
     * @returns {boolean}
     */
    get isGenerator() {
        return this._type === ReflectionMethod.GENERATOR;
    }

    /**
     * Is this function async?
     *
     * @returns {boolean}
     */
    get isAsync() {
        return this._async;
    }

    /**
     * Docblock.
     *
     * @returns {string}
     */
    get docblock() {
        return this._docblock;
    }

    /**
     * Gets the class metadata.
     *
     * @returns {[Function, *][]}
     */
    get metadata() {
        return MetadataStorage.getMetadata(this._method[Symbol.metadata], null);
    }

    /**
     * Gets the method parameters' reflection objects.
     *
     * @returns {ReflectionParameter[]}
     */
    get parameters() {
        return this._parameters;
    }

    /**
     * Gets the reflected method.
     *
     * @returns {Function}
     */
    get method() {
        return this._method;
    }

    /**
     * Parses the method parameter.
     *
     * @private
     */
    _parseParameters() {
        const { Compiler, AST, Parser } = __jymfony.autoload.classLoader.constructor.compiler;
        let parsed;
        try {
            const parser = new Parser();
            parsed = parser.parse('function ' + this._method.toString().replace(/^(async\s+)?(\*\s*)?(function\s+)?/, ''));
        } catch (e) {
            // Do nothing.
            return;
        }

        /**
         * @type {AST.FunctionExpression & AST.Function}
         */
        const func = parsed.body[0];
        if (0 === func.params.length) {
            return;
        }

        for (let parameter of func.params) {
            parameter = parameter.pattern;

            let $default = undefined;
            let restElement = false;
            if (parameter instanceof AST.AssignmentPattern) {
                $default = parameter.right;
                parameter = parameter.left;
            }

            if (parameter instanceof AST.RestElement) {
                parameter = parameter.argument;
                restElement = true;
            } else if (parameter instanceof AST.SpreadElement) {
                parameter = parameter.expression;
                restElement = true;
            }

            let name = null;
            let objectPattern = false;
            let arrayPattern = false;
            if (parameter instanceof AST.Identifier) {
                name = parameter.name;
            } else if (parameter instanceof AST.ObjectPattern) {
                objectPattern = true;
            } else if (parameter instanceof AST.ArrayPattern) {
                arrayPattern = true;
            }

            const index = this._parameters.length;
            this._parameters.push(new __jymfony.ManagedProxy({}, proxy => {
                if (undefined !== $default) {
                    const compiler = new Compiler(new SourceMapGenerator({ skipValidation: true }));
                    try {
                        $default = vm.runInNewContext(compiler.compile($default));
                    } catch (e) {
                        $default = undefined;
                    }
                }

                proxy.initializer = undefined;
                proxy.target = new ReflectionParameter(this, name, index, $default, objectPattern, arrayPattern, restElement);
            }));
        }
    }
}

ReflectionMethod.FUNCTION = 'function';
ReflectionMethod.ASYNC_FUNCTION = 'async function';
ReflectionMethod.GENERATOR = 'generator';

module.exports = global.ReflectionMethod = ReflectionMethod;
