# @op

The @op utility library provides:

* A reflector function.  Provide a class prototype, and this 
function lists the properties and methods, and the decorator 
metadata associated with the members.
* A mechanism for easily converting fields into properties
* An efficient way of attaching metadata to fields declaratively,
in a typesafe manner.  Doing so turns the fields into properties (for the benefit of 
reflection).  This mechanism merges metadata defined in base classes with the sub classes.
* A mechanism to write an inittializer for interface based class
* A way to specify metadata for properties based on interface -- uses psuedoType specifier
* An emmiter function that, given a module namespace, finds all the classes with decorator op.interfaceGenertor() and whose
name starts with an underscore.  It generates an interface with the same
fields / methods as the class

