let obj2map = function (obj) {
    if (Object.getPrototypeOf(obj) !== Object.prototype) {
        return obj;
    }

    let result = new Map;
    for (let [key, value] of objentries(obj)) {
        result.set(key, obj2map(value));
    }

    return result;
};

global.obj2map = obj2map;
