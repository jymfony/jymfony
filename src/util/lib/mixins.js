const symClassType = Symbol('classType');
const symAppliedInterfaces = Symbol('appliedInterface');
const symOuterInterface = Symbol('outerInterface');

global.getInterface = function (definition) {
    // todo: use definition to check if all methods are implemented

    let mixin = (superclass) => class extends superclass {};
    Object.setPrototypeOf(mixin, {
        definition: definition,
        [symClassType]: 'Interface',
        [Symbol.hasInstance]: (o) => {
            let mixins = o.constructor[symAppliedInterfaces];
            if (! mixins) {
                return false;
            }

            return mixins.indexOf(mixin) != -1;
        }
    });

    definition[symOuterInterface] = mixin;
    return mixin;
};

global.getTrait = function (definition) {
    let mixin = (superclass) => {
        let trait = class extends superclass {};
        let inherits = [...Object.getOwnPropertyNames(definition.prototype), ...Object.getOwnPropertySymbols(definition.prototype)];
        for (let prop of inherits) {
            if (prop === 'constructor') {
                continue;
            }

            let descriptor = Object.getOwnPropertyDescriptor(definition.prototype, prop);
            Object.defineProperty(trait.prototype, prop, descriptor);
        }

        return trait;
    };

    Object.setPrototypeOf(mixin, {
        [symClassType]: 'Trait',
    });

    return mixin;
};

global.mix = function (superclass, ...mixins) {
    superclass = superclass || class {};
    superclass = mixins.reduce((a, b) => b(a), superclass);

    let interfaces = Array.from((function * () {
        for (let i of mixins) {
            if (i[symClassType] !== 'Interface') {
                continue;
            }

            let definition = i.definition;
            while (definition) {
                let outer = definition[symOuterInterface];
                if (outer) {
                    yield outer;
                }

                definition = Object.getPrototypeOf(definition);
            }
        }
    })());

    let mixed = (s => class extends s {})(superclass);
    Object.defineProperty(mixed, symAppliedInterfaces, {
        value: [...interfaces],
        enumerable: false
    });

    return mixed;
};

global.implementationOf = function(...interfaces) {
    return global.mix(undefined, ...interfaces);
};
