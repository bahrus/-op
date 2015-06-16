///<reference path='@op.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
if (typeof __metadata !== "function") __metadata = function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
if (typeof __param !== "function") __param = function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Examples;
(function (Examples) {
    //@op.initializer(Address.New2)
    var Address = (function () {
        function Address() {
        }
        __decorate([
            op.toProp(), 
            __metadata('design:type', String)
        ], Address.prototype, "Street");
        __decorate([
            op.toProp(), 
            __metadata('design:type', String)
        ], Address.prototype, "ZipCode");
        return Address;
    })();
    var EmployeeImpl = (function () {
        function EmployeeImpl() {
        }
        return EmployeeImpl;
    })();
    var Employee = (function () {
        function Employee() {
        }
        Object.defineProperty(Employee.prototype, "Surname", {
            get: function () { return null; },
            set: function (v) { },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Employee.prototype, "FirstName", {
            get: function () {
                return this._firstName;
            },
            set: function (val) {
                this._firstName = val;
            },
            enumerable: true,
            configurable: true
        });
        Employee.prototype.DriveHome = function () {
        };
        Employee.prototype.findLocation = function (emp, s) {
            return true;
        };
        Object.defineProperty(Employee.prototype, "Surname",
            __decorate([
                op.initProp(), 
                __metadata('design:type', String)
            ], Employee.prototype, "Surname", Object.getOwnPropertyDescriptor(Employee.prototype, "Surname")));
        Object.defineProperty(Employee.prototype, "FirstName",
            __decorate([
                op.initProp(), 
                __metadata('design:type', String)
            ], Employee.prototype, "FirstName", Object.getOwnPropertyDescriptor(Employee.prototype, "FirstName")));
        __decorate([
            op.plopIntoMeta({
                ColumnDef: {
                    hide: true,
                }
            }), 
            __metadata('design:type', String)
        ], Employee.prototype, "MiddleName");
        __decorate([
            op.toProp(), 
            __metadata('design:type', Address)
        ], Employee.prototype, "HomeAddress");
        Object.defineProperty(Employee.prototype, "DriveHome",
            __decorate([
                op.plopIntoMeta({
                    ColumnDef: {
                        hide: true,
                    }
                }), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], Employee.prototype, "DriveHome", Object.getOwnPropertyDescriptor(Employee.prototype, "DriveHome")));
        __decorate([
            op.reflectionType(Address), 
            __metadata('design:type', Object)
        ], Employee.prototype, "TempAddress");
        Object.defineProperty(Employee.prototype, "findLocation",
            __decorate([
                __param(0, op._), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [Employee, String]), 
                __metadata('design:returntype', Boolean)
            ], Employee.prototype, "findLocation", Object.getOwnPropertyDescriptor(Employee.prototype, "findLocation")));
        __decorate([
            op.plopIntoMeta({
                ColumnDef: {
                    hide: true,
                }
            }), 
            __metadata('design:type', Address)
        ], Employee, "defaultAddress");
        return Employee;
    })();
    Examples.Employee = Employee;
    console.log('reflect Employee => ');
    console.log(op.reflect(Employee, true));
    var ColumnDef = 'ColumnDef';
    var Constraints = 'Constraints';
    var setTitleToFieldNameUC = function (fieldName) {
        return {
            ColumnDef: {
                title: fieldName.toUpperCase(),
            }
        };
    };
    var AddressView = (function (_super) {
        __extends(AddressView, _super);
        function AddressView() {
            _super.apply(this, arguments);
        }
        __decorate([
            op.plopIntoMeta({
                Constraints: {
                    maxLength: 200
                }
            }), 
            __metadata('design:type', String)
        ], AddressView.prototype, "street");
        return AddressView;
    })(Address);
    var EmployeeView = (function (_super) {
        __extends(EmployeeView, _super);
        function EmployeeView() {
            _super.apply(this, arguments);
        }
        __decorate([
            op.plopIntoMeta({
                Constraints: {
                    maxLength: 10
                }
            }),
            op.plopIntoMeta({
                ColumnDef: {
                    width: 200,
                }
            }),
            op.metaPlopper(setTitleToFieldNameUC), 
            __metadata('design:type', String)
        ], EmployeeView.prototype, "MiddleName");
        __decorate([
            op.plopIntoMeta({
                ColumnDef: {
                    width: 100,
                }
            }), 
            __metadata('design:type', String)
        ], EmployeeView.prototype, "Surname");
        __decorate([
            op.toProp(), 
            __metadata('design:type', AddressView)
        ], EmployeeView.prototype, "HomeAddress");
        return EmployeeView;
    })(Employee);
    console.log('reflect on EmployeeView =>');
    console.log(op.reflect(EmployeeView, true));
    console.log('generate interface =>');
    console.log(op.generateInterface(Employee));
    var ev = new EmployeeView();
    ev.MiddleName = 'myMiddleName';
    //const evPropIDLookup = Reflect.getMetadata(op.tsp_propIDLookup, ev);
    //console.log('evPropIDLookup = ');
    //console.log(evPropIDLookup);
    var ev1 = new EmployeeView();
    // const uBound = 1000000;
    // const t1 = new Date();
    // for(let i = 0; i < uBound; i++){
    // 	ev1.Surname = 'name_' + i;
    // }
    // const t2 = new Date();
    // for(let i = 0; i < uBound; i++){
    // 	ev1.FirstName = 'name_' + i;
    // }
    // const t3 = new Date();
    // for(let i = 0; i < uBound; i++){
    // 	ev1.MiddleName = 'name_' + i;
    // }
    // const t4 = new Date();
    // console.log('dynamic property: ' + (t2.getTime() - t1.getTime()));
    // console.log('static property ' + (t3.getTime() - t2.getTime()));
    // console.log('static field ' + (t4.getTime() - t3.getTime()));
    //op.describe(ev);
    var person1 = op.createNew(Employee, {
        FirstName: 'Bruce',
        MiddleName: 'B',
        Surname: 'Anderson',
        HomeAddress: op.createNew(Address, {
            Street: '1600 Pennsylvania Ave',
            ZipCode: '90210'
        }),
    });
    console.log(person1);
    person1.Surname = 'Bruce';
    console.log(person1.Surname);
    ev1.MiddleName = 'test';
})(Examples || (Examples = {}));
//# sourceMappingURL=Employee.js.map