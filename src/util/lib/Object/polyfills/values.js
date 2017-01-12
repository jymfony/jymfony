'use strict';

(() => {
    if (Object.values) {
        return;
    }

    Object.values = function * (O) {
        for (let key of Object.keys(O)) {
            yield O[key];
        }
    };
})();
