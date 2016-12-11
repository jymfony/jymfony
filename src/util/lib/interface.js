global.getInterface = function (superclass) {
    let mixin = () => class extends superclass {};
    Object.setPrototypeOf(mixin, superclass.prototype);
    mixin[Symbol.hasInstance] = (o) => {
        let mixins = o.constructor['_applied_mixins'];
        return mixins.indexOf(mixin) != -1;
    };

    return mixin;
};

global.mix = function (superclass, ...interfaces) {
    superclass = superclass || class {};
    superclass = interfaces.reduce((a, b) => b(a), superclass);

    let mixed = (s => class extends s {})(superclass);
    Object.defineProperty(mixed, '_applied_mixins', {
        value: [superclass, ...interfaces],
        enumerable: false
    });
    return mixed;
};
