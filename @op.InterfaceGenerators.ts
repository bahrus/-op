///<reference path='reflect-metadata.d.ts'/>
///<reference path='@op.ts'/>

module op {
    const memberIndent = '   ';
    const op_autoGenInterface = '@op.autoGenInterface';

    function generateMethod(method: IMethodInfo) {
        let args = '';
        let jsDocParams = '';
        if (method.args) {
            args = method.args.map(arg => arg.name + ': ' +
                getTypeString(arg.argumentTypeClassRef)).join(', ');
            method.args.forEach(arg => {
                jsDocParams += `${memberIndent} * @param {${getTypeString(arg.argumentTypeClassRef) }} ${arg.name}\n\r`
            });
        }
        let returnStr = `${memberIndent}/**\n\r`;
        if (method.metadata[op_description]) {
            returnStr += `${memberIndent}* ${method.metadata[op_description]}\n\r`;
        }
        returnStr += jsDocParams;
        returnStr += `${memberIndent}*/\n\r`;
        returnStr += `${memberIndent}${method.name}(${args});\n\r`;
        return returnStr;
    }

    function generateMethodList(typ: IType): string {
        if (!typ.methods) return '';
        return typ.methods.map(method => generateMethod(method)).join('');
    }

    function generatePropertyList(typ: IType): string {
        const returnStr = typ.properties.map(prop => {
            let returnStr = '';
            if (prop.metadata[op.op_description]) {
                returnStr += `${memberIndent}/**\n\r`;
                returnStr += `${memberIndent}* ${prop.metadata[op_description]}\n\r`;
                returnStr += `${memberIndent}*/\n\r`;
            }
            returnStr += `${memberIndent}${prop.name} : ${getPropertyType(prop) };`;
            return returnStr;
        }).join('\n\r');
        return returnStr;
    }

    export function generateInterface(classRef: Function) {
        const reflectedClass = reflect(classRef, false);
        const factoryString = `
export class ${reflectedClass.name}Factory{
	public static get instance(){
		return new ${reflectedClass.name}();
	}
}
`;
        const interfaceString = `
export interface I${reflectedClass.name}{
${
            generatePropertyList(reflectedClass)
            }
${
            generateMethodList(reflectedClass)
            }
}
`;
        return interfaceString;
    }



    export function generateInterfaces(rootNamespace: Object, namespaceName: string) {
        let returnStrArr = [`module ${namespaceName}{`];
        for (var key in rootNamespace) {
            const member = rootNamespace[key];
            if (typeof member === 'function') {
                const typeInfo = reflect(member);
                if (typeInfo.metadata && typeInfo.metadata[op_autoGenInterface]) {
                    returnStrArr.push(generateInterface(member));
                }

            }
        }
        returnStrArr.push('}');
        const returnStr = returnStrArr.join('\n\r');
        return returnStr;
    }

    export function autoGen(description: string) {
        return (classRef: Function) => {
            Reflect.defineMetadata(op_description, description, classRef.prototype);
            Reflect.defineMetadata(op_autoGenInterface, true, classRef.prototype);
        }
    }
}