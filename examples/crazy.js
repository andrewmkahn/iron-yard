function printThis() {
	console.log(this);
	this.message = 'Pschitt';

}

function myNew(fnCtor) {
	var o = {};
	// 3 ways: call/apply, bind

	fnCtor.call(o);
	return o;
}

var o = new printThis();
console.log(o);

var otherO = new myNew(printThis);
console.log(otherO);