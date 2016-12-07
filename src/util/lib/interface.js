class Interface {
    constructor(throwError = true) {
        if (throwError) {
            throw new Error('Cannot instantiate ' + this.constructor.name);
        }
    }
}

global.Interface = Interface;
