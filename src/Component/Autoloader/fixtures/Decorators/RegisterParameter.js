const registers = [];

function reg(class_, member, parameterIdx) {
    registers.push([ member, parameterIdx ]);
}

decorator @doRegister() {
    @register(reg)
}

export default class Register extends Object {
    @register(reg)
    method(
        @register(reg) @doRegister() arg1 = 'default'
    ) { }

    constructor() {
        super();
    }

    static get registrations() {
        return registers;
    }
}
