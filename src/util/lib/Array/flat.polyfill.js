(() => {
    if (undefined !== Array.prototype.flat) {
        return;
    }

    Object.defineProperty(Array.prototype, 'flat', {
        configurable: true,
        value: function flat(...args) {
            const depth = isNumeric(args[0]) ? Number(args[0]) : 1;

            return depth ? Array.prototype.reduce.call(this, (acc, cur) => {
                if (isArray(cur)) {
                    acc.push(...flat.call(cur, depth - 1));
                } else {
                    acc.push(cur);
                }

                return acc;
            }, []) : Array.prototype.slice.call(this);
        },
        writable: true,
    });
})();
