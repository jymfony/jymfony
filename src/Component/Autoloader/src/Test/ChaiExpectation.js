import { util } from 'chai' with { optional: 'true' };

if (!! util) {
    const getName = util.getName;
    util.getName = (func) => {
        if (ReflectionClass.exists(func)) {
            return ReflectionClass.getClassName(func);
        }

        return getName(func);
    };

    const compatibleConstructor = util.checkError.compatibleConstructor;
    util.checkError.compatibleConstructor = (error, errorLike) => {
        if ('function' === typeof errorLike && ReflectionClass.exists(errorLike)) {
            errorLike = (new ReflectionClass(errorLike)).getConstructor();
        }

        return compatibleConstructor(error, errorLike);
    };

    const getConstructorName = util.checkError.getConstructorName;
    util.checkError.getConstructorName = (errorLike) => {
        if ('function' === typeof errorLike && ReflectionClass.exists(errorLike)) {
            return ReflectionClass.getClassName(errorLike);
        }

        return getConstructorName(errorLike);
    };
}
