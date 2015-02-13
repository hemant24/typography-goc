var jsdom = require("jsdom").jsdom;
var document = jsdom("hello world");
var window = document.parentWindow;

console.log(window.document.documentElement.outerHTML);