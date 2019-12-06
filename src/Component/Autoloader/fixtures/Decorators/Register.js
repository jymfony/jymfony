const registers = [];

function reg(class_, member) {
    registers.push(member);
}

const computedName = 'computed';

@register(reg)
export default class Register extends Object {
    @register(reg)
    static $property;

    @register(reg)
    static $propertyWithDefault = 'default';

    @register(reg)
    property;

    @register(reg)
    [computedName + 'Property'];

    @register(reg)
    propertyWithDefault = 'default';

    @register(reg)
    #privateProperty;

    @register(reg)
    static staticMethod() { }

    @register(reg)
    method() { }

    constructor() {
        super();
    }

    static get registrations() {
        return registers;
    }
}
