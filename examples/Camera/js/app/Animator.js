if (typeof define !== 'function') { 
	var define = require('amdefine')(module)
}
define(function(require) {
	var fabric = require('./Fabric')
	var env = require('./Env')
	
	var fs = require('fs')
	
	var Animator = function(canvas, isPreview){
		this._objs = [];
		console.log(canvas)
		this.canvas = canvas;
		this.playLength = 4000;
		this.isPreview = isPreview
	}
	var now = null;
	var frameCount = 0;
	Animator.prototype.add = function(obj){
		this._objs.push(obj)
		this.canvas.add(obj)
	}
	Animator.prototype.play = function(){
		now = new Date()
		this.renderFrame();
		//this._objs[0].start()
	}
	Animator.prototype.renderFrame = function(){
		var ds = ( new Date()) - now
		for(var i in this._objs){
			var obj = this._objs[i]
			console.log(ds)
			console.log(obj.get('type'))
			if(obj.get('type') == 'aRect' && this.isPreview == true){
				console.log('okay this is camera')
				pinToCenter.call(this, obj)
				
			}
			if(obj.timeToAnimate(ds)){
				console.log('yes animate object time to animate', obj)
				obj.start(ds);
				console.log('after start')
			}
		}
		//console.log(this.renderFrame)
		
		this.canvas.renderAll()
		if(fs!=null){
			var stream = this.canvas.createPNGStream()
			var  out = fs.createWriteStream(__dirname + '/output/frame-' + frameCount +'.png');
			frameCount++;
			console.log('hello',frameCount)
			//console.log(rect)
			stream.pipe(out);
		}
		if(ds < this.playLength){
			_requestAnimFrame(this.renderFrame.bind(this))
		}
	}
	
	  var _requestAnimFrame = fabric.window.requestAnimationFrame       ||
                          fabric.window.webkitRequestAnimationFrame ||
                          fabric.window.mozRequestAnimationFrame    ||
                          fabric.window.oRequestAnimationFrame      ||
                          fabric.window.msRequestAnimationFrame     ||
                          function(callback) {
                            fabric.window.setTimeout(callback, 1000 / 60);
                          };
						  
	function pinToCenter(obj){
		this.canvas.setZoom(2)
		//obj.setCoords() why it is not working
		var canvasCenterPoint = new fabric.Point(this.canvas.getCenter().left, this.canvas.getCenter().top)
		var objectCenterPoint = obj.getCenterPoint();
		
		//obj.setCoords()
		
		console.log(objectCenterPoint.subtract(canvasCenterPoint))
		console.log(objectCenterPoint.subtract(canvasCenterPoint).multiply(2))
		this.canvas.absolutePan(objectCenterPoint.multiply(2).subtract(canvasCenterPoint))
		//this.canvas.absolutePan(objectCenterPoint.subtract(canvasCenterPoint))
		
		//this.canvas.zoomToPoint(objectCenterPoint.subtract(canvasCenterPoint), 1.3)
			//console.log(obj.getCenterPoint())
			
	}
		
	
	
	
	return Animator
});