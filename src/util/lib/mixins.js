const symClassType = Symbol('classType');

global.getInterface = function (definition) {
    // todo: use definition to check if all methods are implemented

    let mixin = (superclass) => class extends superclass {};
    Object.setPrototypeOf(mixin, {
        symClassType: 'Interface',
        [Symbol.hasInstance]: (o) => {
            let mixins = o.constructor['_applied_interfaces'];
            if (! mixins) {
                return false;
            }

            return mixins.indexOf(mixin) != -1;
        }
    });

    return mixin;
};

global.getTrait = function (definition) {
    let mixin = (superclass) => {
        let trait = class extends superclass {};
        for (let prop of Object.getOwnPropertyNames(definition.prototype)) {
            if (prop === 'constructor') {
                continue;
            }

            trait.prototype[prop] = definition.prototype[prop];
        }

        return trait;
    };

    Object.setPrototypeOf(mixin, {
        symClassType: 'Trait',
    });

    return mixin;
};

global.mix = function (superclass, ...mixins) {
    superclass = superclass || class {};
    superclass = mixins.reduce((a, b) => b(a), superclass);

    mixins = mixins.filter(i => i[symClassType] !== 'Interface');

    let mixed = (s => class extends s {})(superclass);
    Object.defineProperty(mixed.constructor, '_applied_interfaces', {
        value: [superclass, ...mixins],
        enumerable: false
    });

    return mixed;
};

global.implementationOf = function(...interfaces) {
    return global.mix(undefined, ...interfaces);
};
