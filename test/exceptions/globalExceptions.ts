import '@types/node';

export class GenericException extends globalThis.Exception {
}

export class NotFoundException extends global.Exception {
}

export class ConstructorOverriddenException extends global.RuntimeException {
    // @ts-ignore
    __construct(thisIsNotAString: object) {
        super.__construct(thisIsNotAString.toString());
    }
}
