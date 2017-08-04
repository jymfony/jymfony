const Mixins = require('./Mixins');
const CLASS_TYPE = 'Interface';

let checkedClassesCache = new Set;

class Interfaces {
    static isInterface(mixin) {
        return mixin[Mixins.classTypeSymbol] === CLASS_TYPE;
    }

    static create(definition) {
        let checks = obj => {
            if (checkedClassesCache.has(obj.constructor)) {
                return;
            }

            for (let descriptor of Mixins.getFunctions(definition)) {
                if (descriptor.fn) {
                    if ('function' === typeof obj[descriptor.fn]) {
                        continue;
                    }

                    if (descriptor['static'] && 'function' === typeof obj.constructor[descriptor.fn]) {
                        continue;
                    }

                    throw new SyntaxError('Method "' + descriptor.fn + '" must be implemented.');
                } else if (descriptor.property) {
                    let target = descriptor['static'] ? obj.constructor : obj;
                    let targetDescriptor = Mixins.getPropertyDescriptor(target, descriptor.property);

                    if (undefined === targetDescriptor) {
                        throw new SyntaxError(
                            __jymfony.sprintf('Getter/Setter for "%s" property must be implemented.', descriptor.property)
                        )
                    }

                    if (descriptor['get'] && undefined === targetDescriptor.get) {
                        throw new SyntaxError('Getter for "' + descriptor.property + '" property must be implemented.');
                    }
                    if (descriptor['set'] && undefined === targetDescriptor.set) {
                        throw new SyntaxError('Setter for "' + descriptor.property + '" property must be implemented.');
                    }
                }
            }

            checkedClassesCache.add(obj.constructor);
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
            if (! isObject(o)) {
                return false;
            }

            let mixins = o.constructor[Mixins.appliedInterfacesSymbol];
            if (! mixins) {
                return false;
            }

            return -1 != mixins.indexOf(mixin);
        };
    }
}

module.exports = Interfaces;
