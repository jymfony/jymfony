const Mixins = require('./Mixins');
const CLASS_TYPE = 'Trait';

class Traits {
    /**
     * @param {Object} mixin
     *
     * @returns {boolean}
     */
    static isTrait(mixin) {
        return mixin[Mixins.classTypeSymbol] === CLASS_TYPE;
    }

    /**
     * @param {Object} definition
     *
     * @returns {Function}
     */
    static create(definition) {
        const inherits = new Map();
        let parent = definition;
        do {
            if (parent.prototype) {
                for (const p of [ ...Object.getOwnPropertyNames(parent.prototype), ...Object.getOwnPropertySymbols(parent.prototype) ]) {
                    if (inherits.has(p)) {
                        continue;
                    }

                    inherits.set(p, Object.getOwnPropertyDescriptor(parent.prototype, p));
                }
            }
        } while (parent = Object.getPrototypeOf(parent));

        const mixin = Mixins.createMixin(definition, trait => {
            for (const [ prop, descriptor ] of inherits.entries()) {
                if ('constructor' === prop || '__construct' === prop) {
                    continue;
                }

                Object.defineProperty(trait.prototype, prop, descriptor);
            }
        }, obj => {
            if (isFunction(definition.prototype.__construct)) {
                definition.prototype.__construct.call(obj);
            }
        });

        Object.setPrototypeOf(mixin, {
            definition: definition,
            [Mixins.classTypeSymbol]: CLASS_TYPE,
        });

        return mixin;
    }
}

module.exports = Traits;
