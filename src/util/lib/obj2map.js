let obj2map = function (obj) {
    if (Object.getPrototypeOf(obj) !== Object.prototype) {
        return obj;
    }

    let result = new Map;
    for (let key in obj) {
        if (! obj.hasOwnProperty(key)) {
            continue;
        }

        result.set(key, obj2map(obj[key]));
    }

    return result;
};

global.obj2map = obj2map;
