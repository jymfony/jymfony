(() => {
    if (!! Object.getOwnPropertyDescriptor(Symbol.prototype, 'description')) {
        return;
    }

    const symbolToString = Symbol.prototype.toString;
    const native = 'Symbol(test)' === String(Symbol('test'));
    const regexp = /^Symbol\((.*)\)[^)]+$/;

    Object.defineProperty(Symbol.prototype, 'description', {
        configurable: true,
        get: function description() {
            const symbol = isObject(this) ? this.valueOf() : this;
            const string = symbolToString.call(symbol);
            const desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');

            return '' === desc ? undefined : desc;
        },
    });
})();
