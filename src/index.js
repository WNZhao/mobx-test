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

// ============================================================
// es2015的实现方式

/* class Animal {
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
document.write(new Dog().age) */

// ==========================================================
// decorator的学习

//会提示Unexpected token 请安装 babel-plugin-transform-decorators-legacy  npm install babel-plugin-transform-decorators-legacy --save-dev
/* 
在babel-loader中添加相关设置
options: {
    presets: ['env'],
    plugins: ['transform-decorators-legacy', 'transform-class-properties']
}
*/

//声明相关注解的功能
/* function log(target) {
    try{ //不加会报null或undefined不能转成object
        const desc = Object.getOwnPropertyDescriptors(target.property);
        for(const key of Object.key(desc)){
            if(key === 'constructor'){
                continue;
            }
            const func = desc[key].value;
            if(typeof func === 'function'){
                Object.defineProperty(target.property,key,{
                    value(...args){
                        console.log('before '+key);
                        const ret = func.apply(this,args);
                        console.log('after '+key);
                        return ret;
                    }
                })
            }
        }
    }catch(e){

    }
    
}
// 修饰类成员的 参数有三个
function readonly(target,key,descriptor){
    descriptor.writable = false;
}

// 检查入参是否合法
function validate(target,key,descriptor){
    const func = descriptor.value;
    descriptor.value = function(...args){
        for(let num of args){
            if('number' !== typeof num){
                throw new Error(`${num} is not a number`);
            }
        }
        return func.apply(this,args)
    }
}

@log  
class Numberic {
    @readonly PI = Math.PI;
    @validate add(...nums) {
        return nums.reduce((p,n)=>p+n,0)
    }
}

let numObj = new Numberic()
console.log(numObj.add(1,2)) 
//Uncaught TypeError: Cannot assign to read only property 'PI' of object '#<Numberic>'
// numObj.PI=3.14 
// Uncaught Error: sss is not a number
// console.log(numObj.add(1,'sss'))
 */


 // ==========================================================
// mobx API 
// npm install mobx -S
// observable的使用 两种使用方式 注解和函数
// 可以对数组 纯对象 es6的map 通过调用observable方法来将其变成一个可观察对象
// 除以上类型外，可以通过observable.box调用来实现将其变成可观察对象
/* 
import mobx, { observable, isArrayLike } from 'mobx'

const arr = observable(['a','b','c']);
console.log(Array.isArray(arr)); //array like object chrom返回true是什么鬼？但确实是一个array like对象
console.log(isArrayLike(arr)); //mobx的API中提供的isArrayLike true
console.log(arr);

// 纯对象
const obj = observable({a:1,b:2});
// 只能对已有属性做监测，如果要监测新属性请使用extendObservable()
console.log(obj.a,obj.b);

// es6的map
const map = observable(new Map());
map.set('a',1);
console.log(map.has('a'));
map.delete('a');
console.log(map.has('a'));

// 原始数据类型 会对其变量进行改造 使用observable.box
let num = observable.box(20)
let str = observable.box('hello')
let bool = observable.box(false)
num.set(50);
str.set('world');
bool.set(true);
console.log(num.get(),str.get(),bool.get())

// 以上是使用函数的调用方式
 */
// ================================================

// 以下是使用decorator方式
// decorator可以修饰类及类成员 详细学习内容请参见es2017
// 如下
/* 
import { observable, computed, autorun } from 'mobx';

class Store {
    @observable array =[];
    @observable obj = {};
    @observable map = new Map();
    // 如果使用注解方式调用时不用box
    @observable num =20;
    @observable str = 'hello';
    @observable bool = true;
}

// mobx对观察的数据作出反应
// computed autorun when reaction

// computed可以作为函数调用 也可以作为注解调用
// 1. computed作用普通函数调用
var store = new Store();
var foo = computed(function() {
    return store.str + '/' + store.num
});
console.log(foo);
// 通过get获取最终结果
console.log(foo.get())
// 监测数据变化
foo.observe(function(change) {
    console.log('===========');
    console.log(change);
    console.log('newValue: ',change.newValue);
    console.log('oldValue: ',change.oldValue);
    console.log('type: ',change.type);
})
store.num = 30;
stor.str = 'world';

// 当修改computed函数包含的可观察成员，就为触发observe回调（如果监听了）
 */
// ================================

// 2. autorun 两个问题 自动运行什么？什么时候触发自动运行 如下autorun(fn) fn为函数 这时computed要使用注解的方式
/* 
import { observable, computed, autorun, when, reaction } from 'mobx';

class Store {
    @observable array =[];
    @observable obj = {};
    @observable map = new Map();
    // 如果使用注解方式调用时不用box
    @observable num =20;
    @observable str = 'hello';
    @observable bool = false;
    // 注意注解computed 后面的get
    @computed get mixed() {
        return this.num + '/' + this.str;
    }
}

let store = new Store();
autorun(()=>{
    console.log(store.str+'/'+store.num)
})
// 注意这里，修改autorun中任意的可观察数据就会触发autorun运行一次，在可观察数据变修改后，自动执行依赖可观察数据的行为，这个行为一般传入autorun的函数。
// @computed的常用使用方式就是放到autorun中
autorun(()=>{
    console.log(store.mixed); //注意是get ，不管改没改第一次都会运行
})

// 3. when 两个参数根据可观察数据来计算布尔值，如果返回真，运行第二个参数（函数）

when(()=>store.bool, ()=>console.log('it\'strue'));
console.log('1');
store.bool=true; //注意这里
console.log('2');
// 如果第一个参数一开始就是真，那么第二个参数会同步执行，注意同步执行

// 4. reaction 两个参数 第一个参数的函数用来告知有哪些数据可被观察数据引用，并在这些数据被修改后执行第二个参数（fn),并把修改的值以数组的形式传递给这个参数（函数），这样就不会像autorun在一开始就执行一次

reaction(
    ()=>[store.str,store.num], //第一个参数，返回要观察的数据
    arr=>console.log(arr.join('/'))
)
store.str = 'world';
store.num = 50;
 */
// =================================================

// action引入

// 这样就不会像autorun在一开始就执行一次，在没有数据时不去作写缓存逻辑，只有在有数据时再动作

// 每次修改都会触发一次autorun或reaction, 如果视图的更新只需要一次就可以了，不需要修改两次还要连续更新两次视图。引入action
/* 
import { observable, computed, reaction, action, autorun, runInAction } from 'mobx';

class Store {
    @observable array =[];
    @observable obj = {};
    @observable map = new Map();
    // 如果使用注解方式调用时不用box
    @observable num =20;
    @observable str = 'hello';
    @observable bool = false;
    // 注意注解computed 后面的get
    @computed get mixed() {
        return this.num + '/' + this.str;
    }
    // 新增action功能
    @action.bound bar() {
        this.str = 'sss';
        this.bool = false;
    }
}

let store = new Store();

reaction(
    ()=>[store.str,store.bool], //第一个参数，返回要观察的数据
    arr=>console.log(arr.join('/'))
)
// autorun(()=>{
//     console.log(store.bool+'/'+store.str)
// })
// store.str = 'world';
// store.num = 40;
// 以上是修改一次触发一次
// 可以使用action或action.bind都是绑定在预先定义的对象或方法上
var bar = store.bar;
bar();

// action或action.bound都是绑定在预先定义好的对象或方法上，mobx还提供了一种语法糖，可以随时定义监测，即把一连串的监测数据修改放到一个action里，就只行一次
runInAction(()=>{
    store.str = 'world';
    store.bool = true;
});

// 或加标识参数
runInAction('modify',()=>{
    store.str = 'world';
    store.bool = false;
})
 */
// ======================================
// ======== 简单应用 =======
// 注意
// 安装 npm install -S react react-dom prop-types mobx-react
// 安装jsx支持 npm i babel-preset-react -D 
// 并在webpack的babel的options中添加react

import ReactDOM from 'react-dom';
import Foo from './demo1components/foo';
import Store from './demo1components/store';
import React from 'react';

const store = new Store();

ReactDOM.render(<Foo cache={store.cache} refresh={store.refresh} />, document.getElementById('xx'))