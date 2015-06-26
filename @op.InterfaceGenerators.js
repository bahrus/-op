///<reference path='reflect-metadata.d.ts'/>
///<reference path='@op.ts'/>
var op;
(function (op) {
    var memberIndent = '   ';
    var op_autoGenInterface = '@op.autoGenInterface';
    function generateMethod(method) {
        var args = '';
        var jsDocParams = '';
        if (method.args) {
            args = method.args.map(function (arg) { return arg.name + ': ' +
                op.getTypeString(arg.argumentTypeClassRef); }).join(', ');
            method.args.forEach(function (arg) {
                jsDocParams += memberIndent + " * @param {" + op.getTypeString(arg.argumentTypeClassRef) + "} " + arg.name + "\n\r";
            });
        }
        var returnStr = memberIndent + "/**\n\r";
        if (method.metadata[op.op_description]) {
            returnStr += memberIndent + "* " + method.metadata[op.op_description] + "\n\r";
        }
        returnStr += jsDocParams;
        returnStr += memberIndent + "*/\n\r";
        returnStr += "" + memberIndent + method.name + "(" + args + ");\n\r";
        return returnStr;
    }
    function generateMethodList(typ) {
        if (!typ.methods)
            return '';
        return typ.methods.map(function (method) { return generateMethod(method); }).join('');
    }
    function generatePropertyList(typ) {
        var returnStr = typ.properties.map(function (prop) {
            var returnStr = '';
            if (prop.metadata[op.op_description]) {
                returnStr += memberIndent + "/**\n\r";
                returnStr += memberIndent + "* " + prop.metadata[op.op_description] + "\n\r";
                returnStr += memberIndent + "*/\n\r";
            }
            returnStr += "" + memberIndent + prop.name + " : " + op.getPropertyType(prop) + ";";
            return returnStr;
        }).join('\n\r');
        return returnStr;
    }
    function generateInterface(classRef) {
        var reflectedClass = op.reflect(classRef, false);
        var factoryString = "\nexport class " + reflectedClass.name + "Factory{\n\tpublic static get instance(){\n\t\treturn new " + reflectedClass.name + "();\n\t}\n}\n";
        var interfaceString = "\nexport interface I" + reflectedClass.name + "{\n" + generatePropertyList(reflectedClass) + "\n" + generateMethodList(reflectedClass) + "\n}\n";
        return interfaceString;
    }
    op.generateInterface = generateInterface;
    function generateInterfaces(rootNamespace, namespaceName) {
        var returnStrArr = [("module " + namespaceName + "{")];
        for (var key in rootNamespace) {
            var member = rootNamespace[key];
            if (typeof member === 'function') {
                var typeInfo = op.reflect(member);
                if (typeInfo.metadata && typeInfo.metadata[op_autoGenInterface]) {
                    returnStrArr.push(generateInterface(member));
                }
            }
        }
        returnStrArr.push('}');
        var returnStr = returnStrArr.join('\n\r');
        return returnStr;
    }
    op.generateInterfaces = generateInterfaces;
    function autoGen(description) {
        return function (classRef) {
            Reflect.defineMetadata(op.op_description, description, classRef.prototype);
            Reflect.defineMetadata(op_autoGenInterface, true, classRef.prototype);
        };
    }
    op.autoGen = autoGen;
})(op || (op = {}));
//# sourceMappingURL=@op.InterfaceGenerators.js.map