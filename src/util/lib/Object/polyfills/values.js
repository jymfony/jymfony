'use strict';

(() => {
    if (Object.values) {
        return;
    }

    Object.values = function (O) {
        return Array.from((function * () {
            for (const key of Object.keys(O)) {
                yield O[key];
            }
        })());
    };
})();
