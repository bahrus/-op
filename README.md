# @op

The @op utility library provides:

* A reflector function.  Provide a class prototype, and this 
function lists the properties and methods, and the decorator 
metadata associated with the members.
* A mechanism for easily converting fields into properties
* An efficient way of attaching metadata to fields declaratively,
in a typesafe manner.  Doing so turns the fields into properties (for the benefit of 
reflection).  This mechanism merges metadata defined in base classes with the sub classes.

