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

    /**
     * Get function names
     *
     * @param {Function} definition
     * @internal
     */
    static getFunctions(definition) {
        let chain = this._getClassChain(definition);

        return Array.from(function * () {
            for (let i of chain) {
                yield * Object.getOwnPropertyNames(i)
                    .filter(P => {
                        if (P === 'constructor') {
                            return false;
                        }

                        return typeof i[P] === 'function';
                    });
            }
        }());
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
                        if (P === '__reflection' || P === 'prototype') {
                            return false;
                        }

                        if (P === 'arguments' || P === 'caller') {
                            // 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context.
                            return false;
                        }

                        if (typeof i[P] === 'function') {
                            return false;
                        }

                        return FunctionProps.indexOf(P) === -1;
                    });
            }
        }());
    }

    static _getClassChain(definition) {
        let chain = [], parent = definition;
        do {
            if (parent[symOuterMixin]) {
                chain.unshift(parent.prototype);
            }
        } while (parent = Object.getPrototypeOf(parent));

        return chain;
    }
}

Mixins.appliedInterfacesSymbol = symAppliedInterfaces;
Mixins.classTypeSymbol = symClassType;

module.exports = Mixins;
