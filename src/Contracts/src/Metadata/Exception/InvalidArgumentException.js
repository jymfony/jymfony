/**
 * @memberOf Jymfony.Contracts.Metadata.Exception
 */
export default class InvalidArgumentException extends global.InvalidArgumentException {
    /**
     * Creates a new instance of InvalidArgumentException with meaningful message.
     *
     * @param {int} reason
     * @param {*} args
     */
    static create(reason, ...args) {
        switch (reason) {
            case __self.CLASS_DOES_NOT_EXIST:
                return new __self(__jymfony.sprintf('Class %s does not exist, cannot retrieve its metadata', args[0]));

            case __self.VALUE_IS_NOT_AN_OBJECT:
                return new __self(__jymfony.sprintf('Cannot create metadata for non-objects. "%s" passed.', typeof args[0]));

            case __self.NOT_MERGEABLE_METADATA:
                return new __self(__jymfony.sprintf(
                    'Cannot merge metadata of class "%s" with "%s"',
                    isObject(args[1]) ? ReflectionClass.getClassName(args[1]) : args[1],
                    isObject(args[0]) ? ReflectionClass.getClassName(args[0]) : args[0],
                ));

            case __self.INVALID_METADATA_CLASS:
                return new __self(__jymfony.sprintf(
                    '"%s% is not a valid metadata object class',
                    isObject(args[0]) ? ReflectionClass.getClassName(args[0]) : args[0]
                ));
        }

        return new __self(__jymfony.sprintf(reason, ...args));
    }
}

InvalidArgumentException.CLASS_DOES_NOT_EXIST = 1;
InvalidArgumentException.VALUE_IS_NOT_AN_OBJECT = 2;
InvalidArgumentException.NOT_MERGEABLE_METADATA = 3;
InvalidArgumentException.INVALID_METADATA_CLASS = 4;
