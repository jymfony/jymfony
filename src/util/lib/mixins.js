const symClassType = Symbol('classType');
const symAppliedInterfaces = Symbol('appliedInterface');
const symOuterInterface = Symbol('outerInterface');

const FunctionProps = Object.getOwnPropertyNames(Function.prototype);

let getConstantsNames = function getConstantsNames(definition) {
    let chain = [], parent = definition;
    do {
        if (parent[symOuterInterface]) {
            chain.unshift(parent);
        }
    } while (parent = Object.getPrototypeOf(parent));

    return Array.from(function * () {
        for (let i of chain) {
            yield * Object.getOwnPropertyNames(i)
                .filter(P => {
                    if (P === '__reflection' || P === 'prototype') {
                        return false;
                    }

                    return FunctionProps.indexOf(P) === -1;
                });
        }
    }());
};

global.getInterface = function (definition) {
    // todo: use definition to check if all methods are implemented

    let mixin = (superclass) => {
        let m = class extends superclass {};
        m.isMixin = true;
        return m;
    };

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

    let constant;
    for (constant of getConstantsNames(definition)) {
        mixin[constant] = definition[constant];
    }

    return mixin;
};

global.getTrait = function (definition) {
    let mixin = (superclass) => {
        let trait = class extends superclass {};

        let inherits = new Map();
        let parent = definition;
        do {
            if (parent.prototype) {
                for (let p of [...Object.getOwnPropertyNames(parent.prototype), ...Object.getOwnPropertySymbols(parent.prototype)]) {
                    if (inherits.has(p)) {
                        continue;
                    }

                    inherits.set(p, Object.getOwnPropertyDescriptor(parent.prototype, p));
                }
            }
        } while (parent = Object.getPrototypeOf(parent));

        for (let [prop, descriptor] of inherits.entries()) {
            if (prop === 'constructor') {
                continue;
            }

            Object.defineProperty(trait.prototype, prop, descriptor);
        }

        return trait;
    };

    Object.setPrototypeOf(mixin, {
        definition: definition,
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

    let mixed = (s => {
        let mixin = class extends s {};
        mixin.isMixin = true;

        return mixin;
    })(superclass);
    Object.defineProperty(mixed, symAppliedInterfaces, {
        value: [...interfaces],
        enumerable: false
    });

    return mixed;
};

global.implementationOf = function(...interfaces) {
    return global.mix(undefined, ...interfaces);
};
