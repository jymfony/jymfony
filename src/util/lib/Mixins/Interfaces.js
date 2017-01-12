const Mixins = require('./Mixins');

const CLASS_TYPE = 'Interface';

class Interfaces {
    static isInterface(mixin) {
        return mixin[Mixins.classTypeSymbol] === CLASS_TYPE;
    }

    static create(definition) {
        let checks = obj => {
            let funcs = Mixins.getFunctions(definition);

            for (let fn of funcs) {
                if ('function' !== typeof obj[fn]) {
                    throw new SyntaxError('Method "' + fn + '" must be implemented');
                }
            }
        };

        let mixin = Mixins.createMixin(definition, undefined, checks);

        Object.setPrototypeOf(mixin, {
            definition: definition,
            [Mixins.classTypeSymbol]: CLASS_TYPE,
            [Symbol.hasInstance]: Interfaces._createHasInstance(mixin),
        });

        return mixin;
    }

    static _createHasInstance(mixin) {
        return o => {
            let mixins = o.constructor[Mixins.appliedInterfacesSymbol];
            if (! mixins) {
                return false;
            }

            return -1 != mixins.indexOf(mixin);
        };
    }
}

module.exports = Interfaces;
