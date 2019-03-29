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
    superclass = mixins.reduce((a, b) => b(a), superclass);

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

    const mixed = (s => {
        const mixin = class extends s {};
        mixin.isMixin = true;

        return mixin;
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
