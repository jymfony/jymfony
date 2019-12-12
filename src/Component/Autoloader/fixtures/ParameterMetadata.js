import { @Type } from '@jymfony/decorators';

export default class ParameterMetadata {
    method(
        arg1,
        @Type('foo') arg2,
        @Type('string') arg3 = 'default'
    ) { }
}
