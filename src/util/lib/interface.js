class Interface {
    constructor() {
        throw new Error('Cannot instantiate '+this.constructor.toString());
    }
}

global.Interface = Interface;
