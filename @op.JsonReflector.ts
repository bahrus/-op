module op {
    export function generateReflectionJSON(classRef: Function, rootName: string) {
        const reflectedClass = op.reflect(classRef, true);
        const reflectionObj: IReflectionObject = {};
        if (reflectedClass.properties) {
            reflectedClass.properties.forEach(prop => {
                reflectionObj.Properties[prop.name] = {
                    path: `${rootName}.${prop.name}`,
                    type: op.getPropertyType(prop.propertyType),
                };
            });
        }
        return JSON.stringify(reflectionObj);
    }

    export interface IReflectionObject {
        Properties?: { [key: string]: IPropertyObject };
    }

    export interface IPropertyObject {
        path: string;
        type: string;

    }
}