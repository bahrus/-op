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
	
	export function description(value: string){
		return (classPrototype: Function, fieldName: string) =>{
			const desc = {
				'@op_description': value,
			}
			plopIntoPropMeta(desc, classPrototype, fieldName);
		}
	}
	
	export interface IReflectionEntity{
		name: string;
	}
	
	export interface IType extends IReflectionEntity{
		properties?: IPropertyInfo[];
		methods?: IMethodInfo[];
		staticProperties?: IPropertyInfo[];
		staticMethods?: IMethodInfo[];
	}
	
	export interface IMemberInfo extends IReflectionEntity{
		propertyDescriptor ?: any;
		metadata?: {[key: string] : any;};
		isPublic?: boolean;
	}
	
	export interface IPropertyInfo extends IMemberInfo {
		propertyType?:  IType;
	}
	
	export interface IMethodInfo extends IMemberInfo {
		returnType?: IType;
	}
	
	export function reflect(classRef : Function, recursive?: boolean){
		const classPrototype = classRef.prototype;
		
		const returnType = reflectPrototype(classPrototype, recursive);
		addMemberInfo(returnType, classRef, false, true);
		return returnType;
	}
	
	const designTypeMetaKey = 'design:type';
	
	function getPropertyType(prop: IPropertyInfo){
		if(!prop.metadata) return 'unknownType';
		const designType = prop.metadata[designTypeMetaKey];
		if(!designType) return 'unknownType';
		const designTypeString = designType.toString().replace('function ', '');
		const iPosOfParenthesis = designTypeString.indexOf('(');
		return designTypeString.substring(0, iPosOfParenthesis);
	}	
	export function generateInterface(classRef : Function){
		const reflectedClass = reflect(classRef, false);
		const interfaceString = `
			interface I${reflectedClass.name}{
				${
					reflectedClass.properties.map(prop =>{
						return ` ${prop.name} : ${getPropertyType(prop)};` 
					}).join('\n\r')
				}
			}
		`;
		return interfaceString;
	}
	
	function getPropertyDescriptor(classPrototype: any, memberKey: string){
		while(classPrototype){
			const propertyDescriptor = Object.getOwnPropertyDescriptor(classPrototype, memberKey);
			if(propertyDescriptor) return propertyDescriptor;
			classPrototype = classPrototype.__proto__;
		}
		return null;
		
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
					const methodInfo = <IMethodInfo> memberInfo;
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
					const propInfo = <IPropertyInfo> memberInfo;
					if(isPrototype){
						if(!returnType.properties) returnType.properties = [];
						returnType.properties.push(propInfo);
					}else{
						if(!returnType.staticProperties) returnType.staticProperties = [];
						returnType.staticProperties.push(propInfo);
					}
					if(recursive){
						const propertyType = Reflect.getMetadata(designTypeMetaKey, classRefOrClassPrototype, memberKey);
						if(propertyType){
							propInfo.propertyType = reflectPrototype(propertyType.prototype, recursive);
						}
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
	
}
