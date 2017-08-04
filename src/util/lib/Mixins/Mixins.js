const FunctionProps = Object.getOwnPropertyNames(Function.prototype);

const symOuterMixin = Symbol('outerMixin');
const symAppliedInterfaces = Symbol('appliedInterfaces');
const symClassType = Symbol('classType');

/**
 * @internal
 */
class Mixins {
    /**
     * Creates a new mixin.
     *
     * @param {Function} definition
     * @param {undefined|Function} cb Modify the newly created inner mixin
     * @param {undefined|Function} constructCb Function to be called on construction
     *
     * @returns {Function}
     */
    static createMixin(definition, cb = undefined, constructCb = undefined) {
        let mixin = (superclass) => {
            let m = class extends superclass {
                constructor() {
                    super(...arguments);

                    if (undefined !== constructCb) {
                        constructCb(this);
                    }
                }
            };

            m.isMixin = true;

            if (undefined !== cb) {
                cb(m);
            }

            return m;
        };

        definition[symOuterMixin] = mixin;

        for (let constant of Mixins.getConstantsNames(definition)) {
            mixin[constant] = definition[constant];
        }

        return mixin;
    }

    static getMixin(definition) {
        return definition[symOuterMixin];
    }

    static getPropertyDescriptor(obj, propKey) {
        do {
            const descriptor = Object.getOwnPropertyDescriptor(obj, propKey);
            if (undefined !== descriptor) {
                return descriptor;
            }
        } while (obj = Object.getPrototypeOf(obj));

        return undefined;
    }

    /**
     * Get function names
     *
     * @param {Function} definition
     * @internal
     */
    static * getFunctions(definition) {
        let chain = this._getClassChain(definition);
        const gen = function * (obj, isStatic) {
            for (let fn of Object.getOwnPropertyNames(obj)) {
                let descriptor = Object.getOwnPropertyDescriptor(obj, fn);
                if ('constructor' !== fn && 'function' === typeof descriptor.value) {
                    yield {'static': isStatic, fn: fn};
                }

                if ('function' === typeof descriptor.get || 'function' === typeof descriptor.set) {
                    yield {
                        'static': isStatic,
                        'property': fn,
                        'get': undefined !== descriptor.get,
                        'set': undefined !== descriptor.set
                    };
                }
            }
        };

        for (let i of chain) {
            yield * gen(i.prototype, false);
            yield * gen(i, true);
        }
    }

    /**
     * Get all constants names for definition.
     *
     * @param {Function} definition
     *
     * @returns {string[]}
     * @internal
     */
    static getConstantsNames(definition) {
        let chain = this._getClassChain(definition);

        return Array.from(function * () {
            for (let i of chain) {
                yield * Object.getOwnPropertyNames(i)
                    .filter(P => {
                        if ('prototype' === P) {
                            return false;
                        }

                        if ('arguments' === P || 'caller' === P) {
                            // 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context.
                            return false;
                        }

                        if ('function' === typeof i[P]) {
                            return false;
                        }

                        return -1 === FunctionProps.indexOf(P);
                    });
            }
        }());
    }

    static _getClassChain(definition) {
        let chain = [], parent = definition;
        do {
            if (parent[symOuterMixin]) {
                chain.unshift(parent);
            }
        } while (parent = Object.getPrototypeOf(parent));

        return chain;
    }
}

Mixins.appliedInterfacesSymbol = symAppliedInterfaces;
Mixins.classTypeSymbol = symClassType;

module.exports = Mixins;
