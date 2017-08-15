const Mixins = require('./Mixins/Mixins');
const Interfaces = require('./Mixins/Interfaces');
const Traits = require('./Mixins/Traits');

global.getInterface = function getInterface(definition) {
    return Interfaces.create(definition);
};

global.getTrait = function getTrait(definition) {
    return Traits.create(definition);
};

global.mix = function mix(superclass, ...mixins) {
    superclass = superclass || __jymfony.JObject;
    superclass = mixins.reduce((a, b) => b(a), superclass);

    let interfaces = Array.from((function * () {
        for (let i of mixins) {
            if (! Interfaces.isInterface(i)) {
                continue;
            }

            let definition = i.definition;
            while (definition) {
                let outer = Mixins.getMixin(definition);
                if (outer) {
                    yield outer;
                }

                definition = Object.getPrototypeOf(definition);
            }
        }
    })());

    let mixed = (s => {
        let mixin = class extends s {};
        mixin.isMixin = true;

        return mixin;
    })(superclass);

    Object.defineProperty(mixed, Mixins.appliedInterfacesSymbol, {
        value: [ ...interfaces ],
        enumerable: false,
    });

    return mixed;
};

global.implementationOf = function implementationOf(...interfaces) {
    return global.mix(undefined, ...interfaces);
};
