const Mixins = require('./Mixins/Mixins');
const Interfaces = require('./Mixins/Interfaces');
const Traits = require('./Mixins/Traits');

/**
 * @param {*} definition
 *
 * @returns {* & MixinInterface}
 */
global.getInterface = function getInterface(definition) {
    return Interfaces.create(definition);
};

/**
 * @param {*} definition
 *
 * @returns {* & MixinInterface}
 */
global.getTrait = function getTrait(definition) {
    return Traits.create(definition);
};

global.mixins = {
    isInterface: Interfaces.isInterface,
    isTrait: Traits.isTrait,
    getInterfaces: (Class) => Class[Mixins.appliedInterfacesSymbol] || [],
    getTraits: (Class) => Class[Mixins.appliedTraitsSymbol] || [],

    /**
     * @internal
     */
    initializerSymbol: Mixins.initializerSymbol,
};

/**
 * @param {*} superclass
 * @param {...*} mixins
 *
 * @returns {Object}
 */
global.mix = function mix(superclass, ...mixins) {
    superclass = superclass || __jymfony.JObject || class {};
    superclass = mixins.reduce((a, b) => {
        if (! isFunction(b)) {
            throw new LogicException(__jymfony.sprintf('Cannot implement/use %s as interface/trait. You probably passed a broken reference to mix/implementationOf.', typeof b));
        }

        return b(a);
    }, superclass);

    const interfaces = Array.from((function * () {
        for (const i of mixins) {
            if (! Interfaces.isInterface(i)) {
                continue;
            }

            let definition = i.definition;
            while (definition) {
                const outer = Mixins.getMixin(definition);
                if (outer) {
                    yield outer;
                }

                definition = Object.getPrototypeOf(definition);
            }
        }
    })()).concat(...(superclass[Mixins.appliedInterfacesSymbol] || []));

    const traits = Array.from((function * () {
        for (const i of mixins) {
            if (! Traits.isTrait(i)) {
                continue;
            }

            let definition = i.definition;
            while (definition) {
                const outer = Mixins.getMixin(definition);
                if (outer) {
                    yield outer;
                }

                definition = Object.getPrototypeOf(definition);
            }
        }
    })()).concat(...(superclass[Mixins.appliedTraitsSymbol] || []));

    const mixed = (s => {
        return class extends s {};
    })(superclass);

    for (const mixin of mixins) {
        for (const name of Mixins.getConstantsNames(mixin.definition)) {
            mixed[name] = mixin[name];
        }
    }

    Object.defineProperty(mixed, Mixins.appliedInterfacesSymbol, {
        value: [ ...interfaces ],
        enumerable: false,
    });

    Object.defineProperty(mixed, Mixins.appliedTraitsSymbol, {
        value: [ ...traits ],
        enumerable: false,
    });

    Object.defineProperty(mixed, Symbol.for('_jymfony_mixin'), {
        value: mixed,
        enumerable: false,
    });

    return mixed;
};

/**
 * @param {...MixinInterface} interfaces
 *
 * @returns {Object}
 */
global.implementationOf = function implementationOf(...interfaces) {
    return global.mix(undefined, ...interfaces);
};
