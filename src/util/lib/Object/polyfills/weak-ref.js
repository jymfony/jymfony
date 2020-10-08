(function () {
    if (global.WeakRef) {
        return;
    }

    const wr = new WeakMap();
    class WeakRef {
        constructor(value) {
            wr.set(this, value);
        }

        deref() {
            return wr.get(this);
        }
    }

    global.WeakRef = WeakRef;
})();
