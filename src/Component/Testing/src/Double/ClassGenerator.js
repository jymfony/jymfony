/**
 * @memberOf Jymfony.Component.Testing.Double
 */
class ClassGenerator {
    __construct(superClass, interfaces) {
        /**
         * @type {Function}
         * @private
         */
        this._superClass = superClass;

        /**
         * @type {[Function]}
         * @private
         */
        this._interfaces = interfaces || [];
    }

    generate() {
        const self = this;
        const mirrorClass = class extends mix(this._superClass, ...this._interfaces) { };
        const proto = Object.getPrototypeOf(mirrorClass);

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
            if (Reflect.has(proto, methodName)) {
                continue;
            }

            let method;
            if (reflMethod.isGenerator) {
                method = function * (...$args) {
                    return yield * self._prophecy.makeProphecyMethodCall(methodName, $args);
                };
            } else if (reflMethod.isAsync) {
                method = function (...$args) {
                    return Promise.resolve(self._prophecy.makeProphecyMethodCall(methodName, $args));
                };
            } else {
                method = function (...$args) {
                    return self._prophecy.makeProphecyMethodCall(methodName, $args);
                };
            }

            Object.defineProperty(proto, methodName, { value: method });
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

        Object.setPrototypeOf(mirrorClass, proto);
        return mirrorClass;
    }
}

module.exports = ClassGenerator;
