const FunctionProps = Object.getOwnPropertyNames(Function.prototype);

const symOuterMixin = Symbol('outerMixin');
const symAppliedInterfaces = Symbol('appliedInterfaces');
const symAppliedTraits = Symbol('appliedTraits');
const symClassType = Symbol('classType');
const symInitalizer = Symbol('Initializer');

/**
 * @internal
 */
class Mixins {
    /**
     * Creates a new mixin.
     *
     * @param {Function} definition
     * @param {undefined|Function} [cb] Modify the newly created inner mixin
     * @param {undefined|Function} [constructCb] Function to be called on construction
     *
     * @returns {Function}
     */
    static createMixin(definition, cb = undefined, constructCb = undefined) {
        const mixin = (superclass) => {
            const m = class extends superclass {
                [symInitalizer](...$args) {
                    if (undefined !== super[symInitalizer]) {
                        super[symInitalizer](...$args);
                    }

                    constructCb(this, ...$args);
                }
            };

            Object.defineProperty(m, Symbol.for('_jymfony_mixin'), {
                value: m,
                enumerable: false,
            });

            if (undefined !== cb) {
                cb(m);
            }

            return m;
        };

        definition[symOuterMixin] = mixin;

        for (const constant of Mixins.getConstantsNames(definition)) {
            mixin[constant] = definition[constant];
        }

        return mixin;
    }

    /**
     * @param {Object} definition
     *
     * @returns {*}
     */
    static getMixin(definition) {
        return definition[symOuterMixin];
    }

    /**
     * @param {Object} obj
     * @param {string} propKey
     *
     * @returns {*}
     */
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
     *
     * @internal
     */
    static * getFunctions(definition) {
        const chain = this._getClassChain(definition);
        const gen = function * (obj, isStatic) {
            for (const fn of Object.getOwnPropertyNames(obj)) {
                const descriptor = Object.getOwnPropertyDescriptor(obj, fn);
                if ('constructor' !== fn && 'function' === typeof descriptor.value) {
                    yield {'static': isStatic, fn: fn};
                }

                if ('function' === typeof descriptor.get || 'function' === typeof descriptor.set) {
                    yield {
                        'static': isStatic,
                        'property': fn,
                        'get': undefined !== descriptor.get,
                        'set': undefined !== descriptor.set,
                    };
                }
            }
        };

        for (const i of chain) {
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
     *
     * @internal
     */
    static getConstantsNames(definition) {
        const chain = this._getClassChain(definition);

        return Array.from(function * () {
            for (const i of chain) {
                yield * [ ...Object.getOwnPropertyNames(i), ...Object.getOwnPropertySymbols(i) ]
                    .filter(P => {
                        if ('prototype' === P || 'length' === P || 'name' === P) {
                            // Function prototype properties
                            return false;
                        }

                        if ('arguments' === P || 'caller' === P) {
                            // 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context.
                            return false;
                        }

                        if ('function' === typeof i[P]) {
                            return false;
                        }

                        if (symOuterMixin === P || Symbol.reflection === P) {
                            return false;
                        }

                        return -1 === FunctionProps.indexOf(P);
                    });
            }
        }());
    }

    /**
     * @param {Object} definition
     *
     * @returns {Array}
     *
     * @private
     */
    static _getClassChain(definition) {
        const chain = [];
        let parent = definition;
        do {
            if (parent[symOuterMixin]) {
                chain.unshift(parent);
            }
        } while (parent = Object.getPrototypeOf(parent));

        return chain;
    }
}

Mixins.appliedInterfacesSymbol = symAppliedInterfaces;
Mixins.appliedTraitsSymbol = symAppliedTraits;
Mixins.classTypeSymbol = symClassType;
Mixins.initializerSymbol = symInitalizer;

module.exports = Mixins;
