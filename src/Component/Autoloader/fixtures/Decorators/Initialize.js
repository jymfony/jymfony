const initializations = [];

function init(obj, fieldName, value) {
    initializations.push([fieldName, value]);
}

const computedName = 'computed';

@initialize(init)
export default class Initialize extends Object {
    @initialize(init)
    static $property;

    @initialize(init)
    static $propertyWithDefault = 'default';

    @initialize(init)
    property;

    @initialize(init)
    [computedName + 'Property'];

    @initialize(init)
    propertyWithDefault = 'default';

    @initialize(init)
    #privateProperty;

    @initialize(init)
    static staticMethod() { }

    @initialize(init)
    method() { }

    constructor() {
        super();
    }

    static get initializations() {
        return initializations;
    }
}
