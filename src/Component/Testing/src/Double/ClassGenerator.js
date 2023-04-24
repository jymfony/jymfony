/**
 * @memberOf Jymfony.Component.Testing.Double
 */
export default class ClassGenerator {
    /**
     * Constructor.
     *
     * @param {Function} superClass
     * @param {Function[]} interfaces
     */
    __construct(superClass, interfaces) {
        /**
         * @type {Function}
         *
         * @private
         */
        this._superClass = superClass;

        /**
         * @type {Function[]}
         *
         * @private
         */
        this._interfaces = interfaces || [];
    }

    /**
     * @returns {Object}
     */
    generate() {
        const self = this;
        const mirrorClass = class _jymfony_testing_doubler_double__ extends mix(this._superClass, ...this._interfaces) { };

        // Reset reflection metadata
        delete mirrorClass[Symbol.reflection];

        const proto = mirrorClass.prototype;

        const methods = {};
        const readableProperties = {};
        const writableProperties = {};

        for (const IF of self._interfaces) {
            const reflection = new ReflectionClass(IF);

            for (const methodName of reflection.methods) {
                methods[methodName] = reflection.getMethod(methodName);
            }

            for (const propertyName of reflection.properties) {
                if (reflection.hasReadableProperty(propertyName)) {
                    readableProperties[propertyName] = true;
                }
                if (reflection.hasWritableProperty(propertyName)) {
                    writableProperties[propertyName] = true;
                }
            }
        }

        for (const [ methodName, reflMethod ] of __jymfony.getEntries(methods)) {
            let method;
            if (reflMethod.isAsync && reflMethod.isGenerator) {
                method = __jymfony.Platform.hasAsyncGeneratorFunctionSupport() ?
                    eval('async function * () { }') :
                    function () {
                        throw new Error('Async generators are not supported by the current version of node');
                    };
            } else if (reflMethod.isGenerator) {
                method = function * () { };
            } else if (reflMethod.isAsync) {
                method = function () { };
            } else {
                method = function () { };
            }

            proto[methodName] = method;
        }

        for (const propName of Object.keys(readableProperties)) {
            const descriptor = {
                get: function () {
                    return undefined;
                },
            };

            if (writableProperties[propName]) {
                descriptor.set = function () { };
                delete writableProperties[propName];
            }

            Object.defineProperty(proto, propName, descriptor);
        }

        for (const propName of Object.keys(writableProperties)) {
            Object.defineProperty(proto, propName, {
                set: function () { },
            });
        }

        return mirrorClass;
    }
}
