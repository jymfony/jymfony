const Mixins = require('./Mixins');

class Traits {
    static create(definition) {
        let inherits = new Map();
        let parent = definition;
        do {
            if (parent.prototype) {
                for (let p of [ ...Object.getOwnPropertyNames(parent.prototype), ...Object.getOwnPropertySymbols(parent.prototype) ]) {
                    if (inherits.has(p)) {
                        continue;
                    }

                    inherits.set(p, Object.getOwnPropertyDescriptor(parent.prototype, p));
                }
            }
        } while (parent = Object.getPrototypeOf(parent));

        let mixin = Mixins.createMixin(definition, trait => {
            for (let [ prop, descriptor ] of inherits.entries()) {
                if ('constructor' === prop) {
                    continue;
                }

                Object.defineProperty(trait.prototype, prop, descriptor);
            }
        });

        Object.setPrototypeOf(mixin, {
            definition: definition,
            [Mixins.classTypeSymbol]: 'Trait',
        });

        return mixin;
    }
}

module.exports = Traits;
