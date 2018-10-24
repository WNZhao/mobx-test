/* function Animal() {}
function Dog() {}

Object.defineProperties(Animal.prototype,{
    name: {
        value() {
            return 'Animal';
        }
    },
    say: {
        value() {
            return `I'm ${this.name}`
        }
    }
})

Object.defineProperties(Dog.prototype,{
    constructor: {
      value: Dog,
      enumerable: false //构造函数是不可枚举的
    },
    name: {
        value() {
            return 'Dog';
        }
    }
}) */


// dog instanceof Animal --> true
// dog.__proto__.__proto__ ...  = Animal.protoype
// 
// dog.__proto__ === Dog.prototype
// Dog.prototype.__proto__ === Animal.prototype

/* 
Dog.prototype = Object.create(Animal.prototype)
document.write(new Dog() instanceof Animal)
document.write("<br />")
document.write(new Dog().say()) */


// es2015的实现方式

class Animal {
    name() {
        return 'Animal';
    }
    say() {
        return `I'm ${this.name()}`
    }
}

class Dog extends Animal {
    age = 16;

    name() {
        return 'Dog'
    }
}
console.log(new Dog().say());
document.write(new Dog().say())
document.write('<br />')
document.write(new Dog().age)