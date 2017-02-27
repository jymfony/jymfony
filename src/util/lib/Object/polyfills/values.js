'use strict';

(() => {
    if (Object.values) {
        return;
    }

    Object.values = function (O) {
        return Array.from((function * () {
            for (let key of Object.keys(O)) {
                yield O[key];
            }
        })());
    };
})();
