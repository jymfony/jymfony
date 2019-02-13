declare namespace Jymfony.Component.Autoloader {
    export class ReflectionException extends Error {
    }
}

declare module NodeJS {
    interface Global {
        ReflectionException: Newable<Jymfony.Component.Autoloader.ReflectionException>;
    }
}
