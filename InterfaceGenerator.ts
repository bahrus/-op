///<reference path='reflect-metadata.d.ts'/>
///<reference path='@op.ts'/>
if (typeof (global) !== 'undefined') {
    require('./@op');
}
module InterfaceGenerator {
    
    declare var WorkerGlobalScope: any;
    
    const memberIndent = '   ';
    const op_autoGenInterface = '@op.autoGenInterface';

    function generateMethod(method: op.IMethodInfo) {
        let args = '';
        let jsDocParams = '';
        if (method.args) {
            args = method.args.map(arg => arg.name + ': ' +
                op.getTypeString(arg.argumentTypeClassRef)).join(', ');
            method.args.forEach(arg => {
                jsDocParams += `${memberIndent} * @param {${op.getTypeString(arg.argumentTypeClassRef) }} ${arg.name}\n\r`
            });
        }
        let returnStr = `${memberIndent}/**\n\r`;
        if (method.metadata[op.op_description]) {
            returnStr += `${memberIndent}* ${method.metadata[op.op_description]}\n\r`;
        }
        returnStr += jsDocParams;
        returnStr += `${memberIndent}*/\n\r`;
        returnStr += `${memberIndent}${method.name}(${args});\n\r`;
        return returnStr;
    }

    function generateMethodList(typ: op.IType): string {
        if (!typ.methods) return '';
        return typ.methods.map(method => generateMethod(method)).join('');
    }

    function generatePropertyList(typ: op.IType): string {
        const returnStr = typ.properties.map(prop => {
            let returnStr = '';
            if (prop.metadata[op.op_description]) {
                returnStr += `${memberIndent}/**\n\r`;
                returnStr += `${memberIndent}* ${prop.metadata[op.op_description]}\n\r`;
                returnStr += `${memberIndent}*/\n\r`;
            }
            returnStr += `${memberIndent}${prop.name} : ${op.getPropertyType(prop) };`;
            return returnStr;
        }).join('\n\r');
        return returnStr;
    }

    export function generateInterface(classRef: Function) {
        console.log('iah');
        console.log(op);
        const reflectedClass = op.reflect(classRef, false);
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
                const typeInfo = op.reflect(member);
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
            Reflect.defineMetadata(op.op_description, description, classRef.prototype);
            Reflect.defineMetadata(op_autoGenInterface, true, classRef.prototype);
        }
    }
    
    // hook global op
    (function(__global: any) {
        if (typeof __global.InterfaceGenerator !== "undefined") {
            if (__global.InterfaceGenerator !== InterfaceGenerator) {
                for (var p in InterfaceGenerator) {
                    __global.InterfaceGenerator[p] = (<any>InterfaceGenerator)[p];
                }
            }
        }
        else {
            __global.InterfaceGenerator = InterfaceGenerator;
        }
    })(
        typeof window !== "undefined" ? window :
            typeof WorkerGlobalScope !== "undefined" ? self :
                typeof global !== "undefined" ? global :
                    Function("return this;")());
}