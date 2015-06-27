///<reference path='reflect-metadata.d.ts'/>
///<reference path='Scripts/typings/node/node.d.ts'/>
if (!Object['assign']) {
    //from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target, firstSource) {
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
var op;
(function (op) {
    var designTypeMetaKey = 'design:type';
    op.op_description = '@op:description';
    op.getter = function (ID) {
        return function () {
            var lu = this['__@op'];
            if (!lu)
                return null;
            return lu[ID];
        };
    };
    op.setter = function (ID) {
        return function (val) {
            var lu = this['__@op'];
            if (!lu) {
                lu = [];
                this['__@op'] = lu;
            }
            lu[ID] = val;
        };
    };
    function initProp() {
        return function (classPrototype, propName, propDescriptor) {
            propDescriptor.get = op.getter(propName);
            propDescriptor.set = op.setter(propName);
        };
    }
    op.initProp = initProp;
    function toProp() {
        var _this = this;
        return function (classPrototype, fieldName) {
            //from http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-ii
            if (delete _this[fieldName]) {
                // Create new property with getter and setter
                Object.defineProperty(classPrototype, fieldName, {
                    get: op.getter(fieldName),
                    set: op.setter(fieldName),
                    enumerable: true,
                    configurable: true
                });
            }
        };
    }
    op.toProp = toProp;
    function plopIntoPropMeta(data, classPrototype, propName) {
        var propertyDescriptor = getPropertyDescriptor(classPrototype, propName);
        if (!propertyDescriptor) {
            toProp()(classPrototype, propName);
        }
        for (var category in data) {
            //const category = propValKey;
            //TODO:  merge
            var newCategoryObj = data[category];
            var prevCategoryObj = Reflect.getMetadata(category, classPrototype, propName);
            if (prevCategoryObj) {
                Object['assign'](newCategoryObj, prevCategoryObj);
            }
            Reflect.defineMetadata(category, newCategoryObj, classPrototype, propName);
        }
    }
    function metaPlopper(fn) {
        return function (classPrototype, fieldName) {
            var data = fn(fieldName);
            plopIntoPropMeta(data, classPrototype, fieldName);
        };
    }
    op.metaPlopper = metaPlopper;
    function plopIntoMeta(data) {
        return function (classPrototype, fieldName) {
            plopIntoPropMeta(data, classPrototype, fieldName);
        };
    }
    op.plopIntoMeta = plopIntoMeta;
    function _(target, key, index) {
        // var indices = Reflect.getMetadata(`log_${key}_parameters`, target, key) || [];
        // debugger;
        // indices.push(index); 
        // Reflect.defineMetadata(`log_${key}_parameters`, indices, target, key);
    }
    op._ = _;
    function description(value) {
        return function (classPrototype, fieldName) {
            var desc = (_a = {},
                _a[op.op_description] = value,
                _a
            );
            plopIntoPropMeta(desc, classPrototype, fieldName);
            var _a;
        };
    }
    op.description = description;
    var PropertyInfo = (function () {
        function PropertyInfo(name, propertyTypeClassRef) {
            this.name = name;
            this.propertyTypeClassRef = propertyTypeClassRef;
        }
        Object.defineProperty(PropertyInfo.prototype, "propertyType", {
            get: function () {
                if (!this._propertyType) {
                    this._propertyType = reflectPrototype(this.propertyTypeClassRef.prototype, true);
                }
                return this._propertyType;
            },
            enumerable: true,
            configurable: true
        });
        return PropertyInfo;
    })();
    op.PropertyInfo = PropertyInfo;
    var MethodInfo = (function () {
        function MethodInfo(name, args, returnTypeClassRef) {
            this.name = name;
            this.args = args;
            this.returnTypeClassRef = returnTypeClassRef;
        }
        Object.defineProperty(MethodInfo.prototype, "returnType", {
            get: function () {
                if (!this._returnType) {
                    this._returnType = reflectPrototype(this.returnTypeClassRef.prototype, true);
                }
                return this._returnType;
            },
            enumerable: true,
            configurable: true
        });
        return MethodInfo;
    })();
    op.MethodInfo = MethodInfo;
    var MethodArgument = (function () {
        function MethodArgument(name, argumentTypeClassRef) {
            this.name = name;
            this.argumentTypeClassRef = argumentTypeClassRef;
        }
        Object.defineProperty(MethodArgument.prototype, "argumentType", {
            get: function () {
                if (!this._argumentType) {
                    this._argumentType = reflectPrototype(this.argumentTypeClassRef.prototype, true);
                }
                return this._argumentType;
            },
            enumerable: true,
            configurable: true
        });
        return MethodArgument;
    })();
    op.MethodArgument = MethodArgument;
    function addClassMeta(classPrototype, returnType) {
        var keys = Reflect.getMetadataKeys(classPrototype);
        returnType.metadata = {};
        for (var i = 0, n = keys.length; i < n; i++) {
            var key = keys[i];
            returnType.metadata[key] = Reflect.getMetadata(key, classPrototype);
        }
    }
    function reflect(classRef, recursive) {
        var classPrototype = classRef.prototype;
        var returnType = reflectPrototype(classPrototype, recursive);
        addMemberInfo(returnType, classRef, false, true);
        addClassMeta(classPrototype, returnType);
        return returnType;
    }
    op.reflect = reflect;
    function getPropertyType(prop) {
        if (!prop.metadata)
            return 'unknownType';
        var designType = prop.metadata[designTypeMetaKey];
        if (!designType)
            return 'unknownType';
        return getTypeString(designType);
    }
    op.getPropertyType = getPropertyType;
    function getTypeString(classRef) {
        var prototypeName = classRef.toString().replace('function ', '');
        var iPosOfParenthesis = prototypeName.indexOf('(');
        return prototypeName.substring(0, iPosOfParenthesis);
    }
    op.getTypeString = getTypeString;
    function getPropertyDescriptor(classPrototype, memberKey) {
        while (classPrototype) {
            var propertyDescriptor = Object.getOwnPropertyDescriptor(classPrototype, memberKey);
            if (propertyDescriptor)
                return propertyDescriptor;
            classPrototype = classPrototype.__proto__;
        }
        return null;
    }
    function substring_between(value, LHDelim, RHDelim) {
        var iPosOfLHDelim = value.indexOf(LHDelim);
        if (iPosOfLHDelim === -1)
            return null;
        var iPosOfRHDelim = value.indexOf(RHDelim);
        if (iPosOfRHDelim === -1)
            return value.substring(iPosOfLHDelim + LHDelim.length);
        return value.substring(iPosOfLHDelim + LHDelim.length, iPosOfRHDelim);
    }
    function addMemberInfo(returnType, classRefOrClassPrototype, isPrototype, recursive) {
        for (var memberKey in classRefOrClassPrototype) {
            var propertyDescriptor = getPropertyDescriptor(classRefOrClassPrototype, memberKey);
            if (propertyDescriptor) {
                var memberInfo = {
                    name: memberKey,
                    propertyDescriptor: propertyDescriptor,
                };
                var metaDataKeys = Reflect.getMetadataKeys(classRefOrClassPrototype, memberKey);
                for (var i = 0, n = metaDataKeys.length; i < n; i++) {
                    var metaKey = metaDataKeys[i];
                    if (!memberInfo.metadata)
                        memberInfo.metadata = {};
                    //debugger;
                    memberInfo.metadata[metaKey] = Reflect.getMetadata(metaKey, classRefOrClassPrototype, memberKey);
                }
                if (propertyDescriptor.value) {
                    //#region method
                    //const methodInfo = <IMethodInfo> memberInfo;
                    var methodInfo = createNew(MethodInfo, memberInfo);
                    var methodSignature = propertyDescriptor.value.toString();
                    var signatureInsideParenthesis = substring_between(methodSignature, '(', ')');
                    if (!signatureInsideParenthesis) {
                        console.log('TODO: handle this scenario');
                        continue;
                    }
                    var paramNames = signatureInsideParenthesis.split(',');
                    if (memberInfo.metadata) {
                        var paramTypes = memberInfo.metadata['design:paramtypes'];
                        if (paramTypes.length > 0) {
                            if (paramNames.length !== paramTypes.length) {
                                throw "Discrepency found in method parameters for method:  " + memberKey;
                            }
                            methodInfo.args = [];
                            methodInfo.returnTypeClassRef = memberInfo.metadata['design:returntype'];
                            for (var i = 0, n = paramTypes.length; i < n; i++) {
                                var paramInfo = new MethodArgument(paramNames[i].trim(), paramTypes[i]);
                                methodInfo.args.push(paramInfo);
                            }
                        }
                    }
                    // methodInfo.args = paramNames.map(arg => {
                    // 	return {
                    // 		name: arg.trim(),
                    // 	}
                    // });
                    if (isPrototype) {
                        if (!returnType.methods)
                            returnType.methods = [];
                        returnType.methods.push(methodInfo);
                    }
                    else {
                        if (!returnType.staticMethods)
                            returnType.staticMethods = [];
                        returnType.staticMethods.push(methodInfo);
                    }
                }
                else if (propertyDescriptor.get || propertyDescriptor.set) {
                    //#region property
                    var propInfo = op.createNew(PropertyInfo, memberInfo);
                    if (isPrototype) {
                        if (!returnType.properties)
                            returnType.properties = [];
                        returnType.properties.push(propInfo);
                    }
                    else {
                        if (!returnType.staticProperties)
                            returnType.staticProperties = [];
                        returnType.staticProperties.push(propInfo);
                    }
                    if (recursive) {
                        var propertyType = Reflect.getMetadata(designTypeMetaKey, classRefOrClassPrototype, memberKey);
                        propInfo.propertyTypeClassRef = propertyType;
                    }
                }
            }
        }
    }
    function reflectPrototype(classPrototype, recursive) {
        var name = classPrototype.constructor.toString().substring(9);
        var iPosOfOpenParen = name.indexOf('(');
        name = name.substr(0, iPosOfOpenParen);
        var returnType = {
            name: name
        };
        addMemberInfo(returnType, classPrototype, true, recursive);
        return returnType;
    }
    function createNew(classRef, obj) {
        var implObj = new classRef();
        Object['assign'](implObj, obj);
        return implObj;
    }
    op.createNew = createNew;
    function assign() {
        var inew = this;
        Object['assign'](inew.target, inew.source);
        return inew.target;
    }
    op.assign = assign;
    function reflectionType(typealias) {
        return function (classPrototype, fieldName) {
            var propertyDescriptor = getPropertyDescriptor(classPrototype, fieldName);
            if (!propertyDescriptor) {
                toProp()(classPrototype, fieldName);
            }
            Reflect.defineMetadata(designTypeMetaKey, typealias, classPrototype, fieldName);
        };
    }
    op.reflectionType = reflectionType;
    // hook global Reflect
    (function (__global) {
        if (typeof __global.op !== "undefined") {
            if (__global.op !== op) {
                for (var p in op) {
                    __global.op[p] = op[p];
                }
            }
        }
        else {
            __global.op = op;
        }
    })(typeof window !== "undefined" ? window :
        typeof WorkerGlobalScope !== "undefined" ? self :
            typeof global !== "undefined" ? global :
                Function("return this;")());
})(op || (op = {}));
//# sourceMappingURL=@op.js.map