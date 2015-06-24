///<reference path='reflect-metadata.d.ts'/>

if (!Object['assign']) {
	//from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

// interface Object{
// 	assign: (targetObj: Object, sourceObj: Object) => Object;
// }



module op{
	
	const designTypeMetaKey = 'design:type';
	const op_description = '@op:description';
	const op_autoGenInterface = '@op.autoGenInterface';
	
	export const getter = function(ID: string){
		return function(){
			const lu = this['__@op'];
			if(!lu) return null;
			return lu[ID];
		}
	}
	
	export const setter = function(ID: string){
		return function(val){
			let lu = this['__@op'];
			if(!lu){
				lu = [];
				this['__@op'] = lu;
			}
			lu[ID] = val;
		}
	}
	
	export function initProp(){
		return (classPrototype: Function, propName: string, propDescriptor: PropertyDescriptor) => {
			propDescriptor.get = getter(propName);
			propDescriptor.set = setter(propName);
		}
	}
	
	export function toProp(){
		return (classPrototype: Function, fieldName: string) =>{
			
			//from http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-ii
			if (delete this[fieldName]) {
			    // Create new property with getter and setter
			    Object.defineProperty(classPrototype, fieldName, {
			      get: getter(fieldName),
			      set: setter(fieldName),
			      enumerable: true,
			      configurable: true
			    });
	  		}
		}
	}
	
	function plopIntoPropMeta(data: any, classPrototype: any, propName: string){
		const propertyDescriptor = getPropertyDescriptor(classPrototype, propName);
		if(!propertyDescriptor){
			toProp()(classPrototype, propName);
		}
		for(const category in data){
			//const category = propValKey;
			//TODO:  merge
			const newCategoryObj = data[category];
			const prevCategoryObj = Reflect.getMetadata(category, classPrototype, propName);
			if(prevCategoryObj){
				Object['assign'](newCategoryObj, prevCategoryObj);
			}
			Reflect.defineMetadata(category, newCategoryObj, classPrototype, propName);
		}
	}
	
	export function metaPlopper<T>(fn: (fieldName: string) => T){
		return (classPrototype: Function, fieldName: string) =>{
			const data = fn(fieldName);
			plopIntoPropMeta(data, classPrototype, fieldName);
		}
	}
	
	export function plopIntoMeta<T>(data: T){
		return (classPrototype: Function, fieldName: string) =>{
			plopIntoPropMeta(data, classPrototype, fieldName);
		}
	}
	
	export function _(target: any, key: string, index: number) {
		// var indices = Reflect.getMetadata(`log_${key}_parameters`, target, key) || [];
		// debugger;
		// indices.push(index); 
		// Reflect.defineMetadata(`log_${key}_parameters`, indices, target, key);
	}
	
	export function description(value: string){
		return (classPrototype: Function, fieldName: string) =>{
			const desc = {
				[op_description]: value,
			}
			plopIntoPropMeta(desc, classPrototype, fieldName);
		}
	}
	
	export interface IReflectionEntity{
		name: string;
		metadata?: {[key: string] : any;};
	}
	
	export interface IType extends IReflectionEntity{
		properties?: IPropertyInfo[];
		methods?: IMethodInfo[];
		staticProperties?: IPropertyInfo[];
		staticMethods?: IMethodInfo[];
		
	}
	
	export interface IMemberInfo extends IReflectionEntity{
		propertyDescriptor ?: any;
		isPublic?: boolean;
	}
	
	export interface IPropertyInfo extends IMemberInfo {
		propertyType?:  IType;
		propertyTypeClassRef?: Function;
	}
	
	export class PropertyInfo implements IPropertyInfo{
		constructor(public name: string, public propertyTypeClassRef: Function){}
		private _propertyType;
		public get propertyType(){
			if(!this._propertyType){
				this._propertyType = reflectPrototype(this.propertyTypeClassRef.prototype, true);
			}
			return this._propertyType;
		}
	
	}
	export interface IMethodInfo extends IMemberInfo {
		returnType?: IType;
		returnTypeClassRef?: Function;
		args?: IMethodArgument[];
	}
	
	export class MethodInfo implements IMethodInfo{
		constructor(public name: string, public args: IMethodArgument[], public returnTypeClassRef?: Function){}
		private _returnType: IType;	
		public get returnType(){
			if(!this._returnType){
				this._returnType = reflectPrototype(this.returnTypeClassRef.prototype, true);
			}
			return this._returnType;
		}	
	}
	
	export interface IMethodArgument extends IReflectionEntity {
		argumentType?:  IType;
		argumentTypeClassRef?: any;
	}
	
	export class MethodArgument implements IMethodArgument{
		constructor(public name: string, public argumentTypeClassRef: Function){}
		private _argumentType : IType;
		public get argumentType(){
			if(!this._argumentType){
				this._argumentType = reflectPrototype(this.argumentTypeClassRef.prototype, true);
			}
			return this._argumentType;
		}
	}
	
	function addClassMeta(classPrototype: any, returnType: IType){
		const keys = Reflect.getMetadataKeys(classPrototype);
		returnType.metadata = {};
		for(let i = 0, n = keys.length; i < n; i++){
			const key = keys[i];
			returnType.metadata[key] = Reflect.getMetadata(key, classPrototype);
		}
	}
	
	export function reflect(classRef : Function, recursive?: boolean){
		const classPrototype = classRef.prototype;
		const returnType = reflectPrototype(classPrototype, recursive);
		addMemberInfo(returnType, classRef, false, true);
		addClassMeta(classPrototype, returnType)
		return returnType;
	}
	
	
	
	function getPropertyType(prop: IPropertyInfo){
		if(!prop.metadata) return 'unknownType';
		const designType = prop.metadata[designTypeMetaKey];
		if(!designType) return 'unknownType';
		return getTypeString(designType); 
	}
	
	function getTypeString(classRef: Function){
		const prototypeName = classRef.toString().replace('function ', '');
		const iPosOfParenthesis = prototypeName.indexOf('(');
		return prototypeName.substring(0, iPosOfParenthesis);
	}
	
	const memberIndent = '   ';
	
	function generateMethod(method: IMethodInfo){
		let args = '';
		let jsDocParams = '';
		if(method.args){
			args = method.args.map(arg => arg.name + ': ' + 
			getTypeString(arg.argumentTypeClassRef)).join(', ');
			method.args.forEach(arg =>{
				jsDocParams += `${memberIndent} * @param {${getTypeString(arg.argumentTypeClassRef)}} ${arg.name}\n\r`
			});
		}
		let returnStr = `${memberIndent}/**\n\r`;
		if(method.metadata[op_description]){
			returnStr += `${memberIndent}* ${method.metadata[op_description]}\n\r`;
		}
		returnStr += jsDocParams;
		returnStr += `${memberIndent}*/\n\r`;
		returnStr +=  `${memberIndent}${method.name}(${args});\n\r`;
		return returnStr;
	}
	
	function generateMethodList(typ: IType) : string {
		if(!typ.methods) return '';
		return typ.methods.map(method => generateMethod(method)).join('');
	}
	
	function generatePropertyList(typ: IType) : string{
		const returnStr = typ.properties.map(prop =>{
			let returnStr = '';
			if(prop.metadata[op_description]){
				returnStr += `${memberIndent}/**\n\r`;
				returnStr += `${memberIndent}* ${prop.metadata[op_description]}\n\r`;
				returnStr += `${memberIndent}*/\n\r`;
			}
			returnStr += `${memberIndent}${prop.name} : ${getPropertyType(prop)};`;
			return  returnStr;
		}).join('\n\r');
		return returnStr;
	}
		
	export function generateInterface(classRef : Function){
		const reflectedClass = reflect(classRef, false);
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
	
	export function generateInterfaces(rootNamespace: Object, namespaceName: string){
		let returnStrArr = [`module ${namespaceName}{`];
		for(var key in rootNamespace){
			const member = rootNamespace[key];
			if (typeof member === 'function'){
				const typeInfo = reflect(member);
				if(typeInfo.metadata && typeInfo.metadata[op_autoGenInterface]){
					returnStrArr.push(generateInterface(member));
				}
				
			}
		}
		returnStrArr.push('}');
		const returnStr = returnStrArr.join('\n\r');
		debugger;
		return returnStr;
	}
	
	function getPropertyDescriptor(classPrototype: any, memberKey: string){
		while(classPrototype){
			const propertyDescriptor = Object.getOwnPropertyDescriptor(classPrototype, memberKey);
			if(propertyDescriptor) return propertyDescriptor;
			classPrototype = classPrototype.__proto__;
		}
		return null;
		
	}
	
	function substring_between(value: string, LHDelim: string, RHDelim: string){
		const iPosOfLHDelim = value.indexOf(LHDelim);
		if(iPosOfLHDelim === -1) return null;
		const iPosOfRHDelim = value.indexOf(RHDelim);
		if(iPosOfRHDelim === -1) return value.substring(iPosOfLHDelim + LHDelim.length);
		return value.substring(iPosOfLHDelim + LHDelim.length, iPosOfRHDelim);
	}
	
	function addMemberInfo(returnType: IType, classRefOrClassPrototype: any, isPrototype: boolean, recursive?: boolean){
		for(const memberKey in classRefOrClassPrototype){
			const propertyDescriptor = getPropertyDescriptor(classRefOrClassPrototype, memberKey);
			if(propertyDescriptor){
				const memberInfo : IMemberInfo = {
					name: memberKey,
					propertyDescriptor : propertyDescriptor,
				};
				const metaDataKeys = Reflect.getMetadataKeys(classRefOrClassPrototype, memberKey);
				for(let i = 0, n = metaDataKeys.length; i < n; i++){
					const metaKey = metaDataKeys[i];
					if(!memberInfo.metadata) memberInfo.metadata = {};
					//debugger;
					memberInfo.metadata[metaKey] = Reflect.getMetadata(metaKey, classRefOrClassPrototype, memberKey);
				}
				if(propertyDescriptor.value){
					//#region method
					//const methodInfo = <IMethodInfo> memberInfo;
					const methodInfo = createNew<MethodInfo, IMemberInfo>(MethodInfo, memberInfo);
					const methodSignature = propertyDescriptor.value.toString();
					const signatureInsideParenthesis = substring_between(methodSignature, '(', ')');
					const paramNames = signatureInsideParenthesis.split(',');
					if(memberInfo.metadata){
						const paramTypes = memberInfo.metadata['design:paramtypes'];
						if(paramTypes.length > 0){
							if(paramNames.length !== paramTypes.length){
							throw `Discrepency found in method parameters for method:  ${memberKey}`;
							}
							methodInfo.args = [];
							methodInfo.returnTypeClassRef = memberInfo.metadata['design:returntype'];
							for(let i = 0, n = paramTypes.length; i < n; i++){
								const paramInfo = new MethodArgument(paramNames[i].trim(), paramTypes[i]);
								
								methodInfo.args.push(paramInfo);
							}
						}
					}
					
					
					// methodInfo.args = paramNames.map(arg => {
						
					// 	return {
					// 		name: arg.trim(),
					// 	}
					// });
					if(isPrototype){
						if(!returnType.methods) returnType.methods = [];
						returnType.methods.push(methodInfo);
					}else{
						if(!returnType.staticMethods) returnType.staticMethods = [];
						returnType.staticMethods.push(methodInfo);
					}
					
					//#endregion
				}else if(propertyDescriptor.get || propertyDescriptor.set){
					//#region property
					const propInfo = op.createNew<PropertyInfo, IMemberInfo>(PropertyInfo, memberInfo); 
					
					if(isPrototype){
						if(!returnType.properties) returnType.properties = [];
						returnType.properties.push(propInfo);
					}else{
						if(!returnType.staticProperties) returnType.staticProperties = [];
						returnType.staticProperties.push(propInfo);
					}
					 if(recursive){
						const propertyType = Reflect.getMetadata(designTypeMetaKey, classRefOrClassPrototype, memberKey);
						propInfo.propertyTypeClassRef = propertyType;
					// 	if(propertyType){
					// 		propInfo.propertyType = reflectPrototype(propertyType.prototype, recursive);
					// 	}
					}
					
					//#endregion
				}
			}
			
		}
	}
	
	function reflectPrototype(classPrototype: any, recursive?: boolean){
		let name : string = classPrototype.constructor.toString().substring(9);
		const iPosOfOpenParen = name.indexOf('(');
		name = name.substr(0, iPosOfOpenParen);
		const returnType : IType = {
			name: name
		}
		addMemberInfo(returnType, classPrototype, true, recursive);
		return returnType;
	}
	
	// export function initializer(classInitFn: Function){
	// 	return function(target: Function){
	// 		//debugger;
	// 	}
	// }
	
	export function createNew<InterfaceImplementorType, InterfaceType>(classRef: Function, obj: InterfaceType ){
		const implObj = new (<any>classRef)();
		Object['assign'](implObj, obj);
		return <InterfaceImplementorType> implObj;
	}
	
	export function reflectionType(typealias: Function){
		return (classPrototype: Function, fieldName: string) =>{
			const propertyDescriptor = getPropertyDescriptor(classPrototype, fieldName);
			if(!propertyDescriptor){
				toProp()(classPrototype, fieldName);
			}
			Reflect.defineMetadata(designTypeMetaKey, typealias, classPrototype, fieldName);
		}
	}
	
	export function autoGen(description: string){
		return (classRef: Function) => {
			Reflect.defineMetadata(op_description, description, classRef.prototype);
			Reflect.defineMetadata(op_autoGenInterface, true, classRef.prototype);
		}
	}
	
}
