const Type = Jymfony.Component.Autoloader.Decorator.Type;

export default class ParameterMetadata {
    method(
        arg1,
        @Type('foo') arg2,
        @Type('string') arg3 = 'default'
    ) { }
}
