const Caster = Jymfony.Component.VarDumper.Caster;

/**
 * @type {*[]}
 */
const casters = [
    [ Caster.ConstStub, Caster.StubCaster.castStub ],
    [ Caster.EnumStub, Caster.StubCaster.castEnum ],

    [ RegExp, Caster.RegExpCaster.castRegExp ],
    [ Date, Caster.DateCaster.castDate ],
    [ Buffer, Caster.BufferCaster.castBuffer ],

    [ Error, Caster.ErrorCaster.castError ],
    [ Caster.TraceStub, Caster.ErrorCaster.castTraceStub ],
    [ Caster.FrameStub, Caster.ErrorCaster.castFrameStub ],
    [ Jymfony.Component.VarDumper.Exception.ThrowingCasterException, Caster.ErrorCaster.castThrowingCasterException ],
    [ Jymfony.Component.VarDumper.Cloner.AbstractCloner, Caster.StubCaster.cutInternals ],
];

if (__jymfony.RegExp) {
    casters.push([ __jymfony.RegExp, Caster.RegExpCaster.castRegExp ]);
}

if (ReflectionClass.exists('Jymfony.Component.DateTime.DateTime')) {
    casters.push([ Jymfony.Component.DateTime.DateTime, Caster.DateCaster.castDateTime ]);
    casters.push([ Jymfony.Component.DateTime.DateTimeZone, Caster.DateCaster.castDateTimeZone ]);
}

if (ReflectionClass.exists('Jymfony.Component.DependencyInjection.ContainerInterface')) {
    casters.push([ Jymfony.Component.DependencyInjection.ContainerInterface, Caster.StubCaster.cutInternals ]);
}

module.exports = casters;
