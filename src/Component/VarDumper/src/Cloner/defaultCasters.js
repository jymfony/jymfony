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

    [ ReflectionClass, Caster.ReflectionCaster.castReflectionClass ],

    [ HashTable, Caster.DataStructureCaster.castHashTable ],
    [ PriorityQueue, Caster.DataStructureCaster.castDataStructure ],
    [ BTree, Caster.DataStructureCaster.castDataStructure ],
    [ LinkedList, Caster.DataStructureCaster.castDataStructure ],

    [ Set, Caster.DataStructureCaster.castSet ],
];

if (__jymfony.RegExp) {
    casters.push([ __jymfony.RegExp, Caster.RegExpCaster.castRegExp ]);
}

if (ReflectionClass.exists('Jymfony.Component.DateTime.DateTime')) {
    casters.push([ Jymfony.Component.DateTime.DateTime, Caster.DateCaster.castDateTime ]);
    casters.push([ Jymfony.Component.DateTime.DateTimeZone, Caster.DateCaster.castDateTimeZone ]);
}

if (ReflectionClass.exists('Jymfony.Contracts.DependencyInjection.ContainerInterface')) {
    casters.push([ Jymfony.Contracts.DependencyInjection.ContainerInterface, Caster.StubCaster.cutInternals ]);
}

export { casters };
