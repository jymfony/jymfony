const ArrayPattern = require('../Parser/AST/ArrayPattern');
const AssignmentPattern = require('../Parser/AST/AssignmentPattern');
const ClassLoader = require('../ClassLoader');
const Compiler = require('../Parser/Compiler');
const DescriptorStorage = require('../DescriptorStorage');
const Identifier = require('../Parser/AST/Identifier');
const ObjectPattern = require('../Parser/AST/ObjectPattern');
const Parser = require('../Parser/Parser');
const ReflectionParameter = require('./ReflectionParameter');
const RestElement = require('../Parser/AST/RestElement');
const SourceMapGenerator = require('../Parser/SourceMap/Generator');
const vm = require('vm');

const descriptorStorage = new DescriptorStorage(
    new ClassLoader(__jymfony.autoload.finder, require('path'), vm)
);

/**
 * Reflection utility for class method.
 */
class ReflectionMethod {
    /**
     * Constructor.
     *
     * @param {ReflectionClass} reflectionClass
     * @param {string} methodName
     */
    constructor(reflectionClass, methodName) {
        /**
         * @type {ReflectionClass}
         *
         * @private
         */
        this._class = reflectionClass;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = methodName;

        /**
         * @type {Function}
         *
         * @private
         */
        this._method = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = false;

        let method;
        if ((method = reflectionClass._methods[methodName])) {
            this._method = method;
        } else if ((method = reflectionClass._staticMethods[methodName])) {
            this._method = method;
            this._static = true;
        } else {
            throw new ReflectionException('Unknown method "' + methodName + '\'');
        }

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

        const classConstructor = reflectionClass.getConstructor();

        /**
         * @type {Function}
         *
         * @private
         */
        this._method = this._static ? classConstructor[methodName] : classConstructor.prototype[methodName];

        /**
         * @type {ReflectionParameter[]}
         *
         * @private
         */
        this._parameters = [];
        this._parseParameters();

        /**
         * @type {string}
         *
         * @private
         */
        this._docblock = (this._static ? classConstructor[methodName] : classConstructor.prototype[methodName])[Symbol.docblock];
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
        return MetadataStorage.getMetadata(this._class.getConstructor(), this._name);
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
     * Parses the method parameter.
     *
     * @private
     */
    _parseParameters() {
        let parsed;
        try {
            const parser = new Parser(descriptorStorage);
            parsed = parser.parse('function ' + this._method.toString());
        } catch (e) {
            // Do nothing.
            return;
        }

        /**
         * @type {Jymfony.Component.Autoloader.Parser.AST.FunctionExpression & Jymfony.Component.Autoloader.Parser.AST.Function}
         */
        const func = parsed.body[0];
        if (0 === func.params.length) {
            return;
        }

        for (let parameter of func.params) {
            parameter = parameter.pattern;

            let $default = undefined;
            let restElement = false;
            if (parameter instanceof AssignmentPattern) {
                $default = parameter.right;
                parameter = parameter.left;
            }

            if (parameter instanceof RestElement) {
                parameter = parameter.argument;
                restElement = true;
            }

            let name = null;
            let objectPattern = false;
            let arrayPattern = false;
            if (parameter instanceof Identifier) {
                name = parameter.name;
            } else if (parameter instanceof ObjectPattern) {
                objectPattern = true;
            } else if (parameter instanceof ArrayPattern) {
                arrayPattern = true;
            }

            this._parameters.push(new __jymfony.ManagedProxy({}, proxy => {
                if (undefined !== $default) {
                    const compiler = new Compiler(new SourceMapGenerator({ skipValidation: true }));
                    $default = vm.runInNewContext(compiler.compile($default));
                }

                proxy.initializer = undefined;
                proxy.target = new ReflectionParameter(this, name, $default, objectPattern, arrayPattern, restElement);
            }));
        }
    }
}

ReflectionMethod.FUNCTION = 'function';
ReflectionMethod.ASYNC_FUNCTION = 'async function';
ReflectionMethod.GENERATOR = 'generator';

module.exports = global.ReflectionMethod = ReflectionMethod;
