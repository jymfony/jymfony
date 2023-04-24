const Mixins = require('./Mixins/Mixins');
const Interfaces = require('./Mixins/Interfaces');
const Traits = require('./Mixins/Traits');

globalThis.getInterface = function getInterface(definition, ...parents) {
    return Interfaces.create(definition, ...parents);
};

globalThis.getTrait = function getTrait(definition) {
    return Traits.create(definition);
};

globalThis.mixins = {
    isInterface: Interfaces.isInterface,
    isTrait: Traits.isTrait,
    getParents: Mixins.getParents,
    getInterfaces: (Class) => Class[Mixins.appliedInterfacesSymbol] || [],
    getTraits: (Class) => Class[Mixins.appliedTraitsSymbol] || [],

    /**
     * @internal
     */
    initializerSymbol: Mixins.initializerSymbol,
};

globalThis.mix = function mix(superclass, ...mixins) {
    superclass = superclass || __jymfony.JObject || class {};
    superclass = mixins.reduce((a, b) => {
        if (! isFunction(b)) {
            throw new LogicException(__jymfony.sprintf('Cannot implement/use %s as interface/trait. You probably passed a broken reference to mix/implementationOf.', typeof b));
        }

        return b(a);
    }, superclass);

    for (const i of mixins) {
        if (! Interfaces.isInterface(i)) {
            continue;
        }

        for (const sup of i[Mixins.superInterfaces]) {
            mixins.push(sup);
        }
    }

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

globalThis.implementationOf = function implementationOf(...interfaces) {
    return globalThis.mix(undefined, ...interfaces);
};
