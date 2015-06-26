///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='@op.ts'/>
///<reference path='@op.InterfaceGenerators.ts'/>
///<reference path='@op.JsonReflector.ts'/>
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
if (typeof __param !== "function") __param = function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Examples;
(function (Examples) {
    var Address = (function () {
        function Address() {
        }
        __decorate([
            op.toProp()
        ], Address.prototype, "Street");
        __decorate([
            op.toProp()
        ], Address.prototype, "ZipCode");
        return Address;
    })();
    Examples.Address = Address;
    var EmployeeImpl = (function () {
        function EmployeeImpl() {
        }
        return EmployeeImpl;
    })();
    var EmployeeFactory = (function () {
        function EmployeeFactory() {
        }
        Object.defineProperty(EmployeeFactory, "instance", {
            get: function () {
                return new Employee();
            },
            enumerable: true,
            configurable: true
        });
        return EmployeeFactory;
    })();
    Examples.EmployeeFactory = EmployeeFactory;
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
                op.initProp()
            ], Employee.prototype, "Surname", Object.getOwnPropertyDescriptor(Employee.prototype, "Surname")));
        Object.defineProperty(Employee.prototype, "FirstName",
            __decorate([
                op.initProp()
            ], Employee.prototype, "FirstName", Object.getOwnPropertyDescriptor(Employee.prototype, "FirstName")));
        __decorate([
            op.plopIntoMeta({
                ColumnDef: {
                    hide: true,
                }
            }),
            op.description("Middle Name of Employee")
        ], Employee.prototype, "MiddleName");
        __decorate([
            op.toProp()
        ], Employee.prototype, "HomeAddress");
        Object.defineProperty(Employee.prototype, "DriveHome",
            __decorate([
                op.plopIntoMeta({
                    ColumnDef: {
                        hide: true,
                    }
                })
            ], Employee.prototype, "DriveHome", Object.getOwnPropertyDescriptor(Employee.prototype, "DriveHome")));
        __decorate([
            op.reflectionType(Address)
        ], Employee.prototype, "TempAddress");
        Object.defineProperty(Employee.prototype, "findLocation",
            __decorate([
                __param(0, op._)
            ], Employee.prototype, "findLocation", Object.getOwnPropertyDescriptor(Employee.prototype, "findLocation")));
        __decorate([
            op.plopIntoMeta({
                ColumnDef: {
                    hide: true,
                }
            })
        ], Employee, "defaultAddress");
        Employee = __decorate([
            op.autoGen("Information about an employee")
        ], Employee);
        return Employee;
    })();
    Examples.Employee = Employee;
    // Object.defineProperty(Employee, 'instance', {
    //   get: () =>{
    // 	  return new Employee();
    //   },
    //   enumerable: true,
    //   configurable: true
    // });
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
            })
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
            op.metaPlopper(setTitleToFieldNameUC)
        ], EmployeeView.prototype, "MiddleName");
        __decorate([
            op.plopIntoMeta({
                ColumnDef: {
                    width: 100,
                }
            })
        ], EmployeeView.prototype, "Surname");
        __decorate([
            op.toProp()
        ], EmployeeView.prototype, "HomeAddress");
        return EmployeeView;
    })(Employee);
    console.log('reflect on EmployeeView =>');
    console.log(op.reflect(EmployeeView, true));
    console.log('generate interface =>');
    console.log(op.generateInterface(Employee));
    console.log(op.generateInterfaces(Examples, 'Examples'));
    var ev = new EmployeeView();
    ev.MiddleName = 'myMiddleName';
    var ev1 = new EmployeeView();
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
    var newEmployee = {
        do: op.assign,
        source: {
            FirstName: 'George',
            MiddleName: 'Carl',
        },
        target: EmployeeFactory.instance,
    };
    console.log(newEmployee.do().FirstName);
    console.log(op.generateReflectionJSON(Employee, 'obj'));
})(Examples || (Examples = {}));
//# sourceMappingURL=Employee.js.map