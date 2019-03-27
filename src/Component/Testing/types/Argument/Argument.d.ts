declare namespace Jymfony.Component.Testing.Argument {
    import Token = Jymfony.Component.Testing.Argument.Token;

    export class Argument {
        static exact(value: any): Token.ExactValueToken;

        static type(type: Constructor<any>): Token.TypeToken;

        static that(callback: Invokable<boolean>): Token.CallbackToken;

        static any(): Token.AnyValueToken;

        static cetera(): Token.AnyValuesToken;

        static identical(value: any): Token.IdenticalValueToken;

        static approximate(value: number, precision?: number): Token.ApproximateValueToken;
    }
}
