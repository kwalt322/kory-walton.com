// Now supporting Babel 7.2
// Testing out some ES6 features. Feel free to delete this.

// require
let test = require("./test");
test.foo();

// constants
const PI = 3.142;

// string interpolation
var message = `The answer is ${PI}`

console.log(message);

// classes
class Shape {
    constructor (id, x, y) {
        this.id = id
        this.move(x, y)
    }
    move (x, y) {
        this.x = x
        this.y = y
    }
}

var s = new Shape("Square", 5, 5);

s.move(10, 10);

console.log(s.x, s.y);

var a = [1, 2, 3, 4, 5];

// Arrow functions
a = a.filter( x => x > 3);

console.log(a);