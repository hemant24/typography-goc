var fs = require('fs'),
    fabric = require('fabric').fabric;
   

var canvas = fabric.createCanvasForNode(1024, 768);
var text = new fabric.Text('Hello world', {
  left: 100,
  top: 100,
  fill: '#f55',
});
canvas.add(text);

text.animate('angle', 45, {
	  onChange: output,//canvas.renderAll.bind(canvas),
	  duration: 1000,
	  easing: fabric.util.ease.easeOutBounce
	});

var i = 0
function output(){
canvas.renderAll.bind(canvas)
var  out = fs.createWriteStream(__dirname + '/' + i +'.png');
i++;
console.log('hello')
var stream = canvas.createPNGStream();
	stream.on('data', function(chunk) {
	  out.write(chunk);
});
}