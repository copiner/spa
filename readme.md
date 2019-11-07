### spa
把页面写成模板，按需拉取，或者通过get请求拉去页面片段，原生单页面应用，涉及Dom操作。

dom操作繁琐，怎样把html写入js文件中，或者说，通过js去生成html展示

### react
react引入了virtual dom，也就是通过特殊语法（jsx)的js文件，编译出能生成真实dom的js对象，
这个能生成真实dom的对象，就是virtual dom，其中牵涉dom更新算法。

react做了组件的比较更新，即是virtual dom比较，然后渲染出真是的dom，或者更新变更的dom,
相对应的是传统真实dom的操作，比如传统框架jquery

React的诞生改变了JavaScript的世界。其中最大的变化是React推广了Virtual DOM（我们稍后探究）并创造了新的语法——JSX，
JSX允许开发者在JavaScript中书写HTML（译者注：即HTML in JavaScript）。

react把页面html写入了js，es6引入模块化(import)，便可进行组件化开发，再借助打包工具，实现工程项目开发。

### vue

Vue致力解决的问题与React一致，但却提供了另外一套解决方案。
Vue使用模板系统而不是JSX，使其对现有应用的升级更加容易。
这是因为模板用的就是普通的HTML，通过Vue来整合现有的系统是比较容易的，不需要整体重构。
同时Vue声称它更容易学习，我最近才接触Vue，能证明所言非虚。关于Vue还需要说的是，Vue主要是由一位开发者进行维护的，而不像React一样由如Facebook这类大公司维护。
