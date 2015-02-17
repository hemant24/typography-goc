//Import easel
require('node-easel');
var Canvas = require('canvas')
var Stage = createjs.Stage;
var Shape = createjs.Shape;
var Graphics = createjs.Graphics;

var fs = require('fs');
var c = new Canvas(980, 580);
 var stage = new createjs.Stage(c);
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
        circle.x = 100;
        circle.y = 100;
        stage.addChild(circle);
        stage.update();
		


//Create a PNG file.
fs.writeFile(__dirname + '/public/circle.png', c.toBuffer(), function() {
	console.log(__dirname)
    createjs.Ticker.halt();
});