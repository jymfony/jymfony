const ArrayExpression = require('./ArrayExpression');
const AssignmentExpression = require('./AssignmentExpression');
const CallExpression = require('./CallExpression');
const ClassMethod = require('./ClassMethod');
const Class = require('./Class');
const DeclarationInterface = require('./DeclarationInterface');
const ExpressionStatement = require('./ExpressionStatement');
const Identifier = require('./Identifier');
const MemberExpression = require('./MemberExpression');
const NewExpression = require('./NewExpression');
const NullLiteral = require('./NullLiteral');
const StringLiteral = require('./StringLiteral');

/**
 * @memberOf Jymfony.Component.Autoloader.Parser.AST
 */
class ClassDeclaration extends mix(Class, DeclarationInterface) {
    compile(compiler) {
        super.compile(compiler);

        if (this.decorators) {
            const decorators = this.decorators.filter(([ id ]) => '@Annotation' !== id);

            const annotationsExpression = new ArrayExpression(null, decorators.map(([ identifier, args ]) => {
                return new NewExpression(
                    null,
                    new Identifier(null, identifier.substr(1)),
                    null === args ? [] : args
                );
            }));

            compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
                null,
                '=',
                new MemberExpression(
                    null,
                    this.id,
                    new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'annotations'), false),
                    true,
                ),
                annotationsExpression
            )));
            compiler._emit(';\n');
        }

        compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
            null,
            '=',
            new MemberExpression(
                null,
                this.id,
                new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false),
                true,
            ),
            this.docblock ? new StringLiteral(null, JSON.stringify(this.docblock)) : new NullLiteral(null)
        )));
        compiler._emit(';\n');

        for (const member of this._body._body) {
            const decorators = member.decorators;
            if (! decorators || 0 === decorators.length || ! (member instanceof ClassMethod)) {
                continue;
            }

            const annotationsExpression = new ArrayExpression(null, decorators.map(([ identifier, args ]) => {
                return new NewExpression(
                    null,
                    new Identifier(null, identifier.substr(1)),
                    null === args ? [] : args
                );
            }));

            if ('method' === member.kind) {
                compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        new MemberExpression(
                            null,
                            member.static ? this.id : new MemberExpression(null, this.id, new Identifier(null, 'prototype')),
                            member.id,
                            ! (member.id instanceof Identifier)
                        ),
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'annotations'), false),
                        true,
                    ),
                    annotationsExpression
                )));
            } else if ('get' === member.kind || 'set' === member.kind) {
                compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        new MemberExpression(
                            null,
                            new CallExpression(null, new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'getOwnPropertyDescriptor'), false), [
                                member.static ? this.id : new MemberExpression(null, this.id, new Identifier(null, 'prototype'), false),
                                member.id instanceof Identifier ? new StringLiteral(null, JSON.stringify(member.id.name)) : member.id,
                            ]),
                            new Identifier(null, member.kind),
                            false
                        ),
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'annotations'), false),
                        true,
                    ),
                    annotationsExpression
                )));
            }

            compiler._emit(';\n');
        }

        for (const member of this._body._body) {
            if (! member.docblock || ! (member instanceof ClassMethod)) {
                continue;
            }

            if ('method' === member.kind) {
                compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        new MemberExpression(
                            null,
                            member.static ? this.id : new MemberExpression(null, this.id, new Identifier(null, 'prototype')),
                            member.id,
                            ! (member.id instanceof Identifier)
                        ),
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false),
                        true,
                    ),
                    member.docblock ? new StringLiteral(null, JSON.stringify(member.docblock)) : new NullLiteral(null)
                )));
            } else if ('get' === member.kind || 'set' === member.kind) {
                compiler.compileNode(new ExpressionStatement(null, new AssignmentExpression(
                    null,
                    '=',
                    new MemberExpression(
                        null,
                        new MemberExpression(
                            null,
                            new CallExpression(null, new MemberExpression(null, new Identifier(null, 'Object'), new Identifier(null, 'getOwnPropertyDescriptor'), false), [
                                member.static ? this.id : new MemberExpression(null, this.id, new Identifier(null, 'prototype'), false),
                                member.id instanceof Identifier ? new StringLiteral(null, JSON.stringify(member.id.name)) : member.id,
                            ]),
                            new Identifier(null, member.kind),
                            false
                        ),
                        new MemberExpression(null, new Identifier(null, 'Symbol'), new Identifier(null, 'docblock'), false),
                        true,
                    ),
                    member.docblock ? new StringLiteral(null, JSON.stringify(member.docblock)) : new NullLiteral(null)
                )));
            }

            compiler._emit(';\n');
        }
    }
}

module.exports = ClassDeclaration;
