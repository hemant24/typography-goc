var motionText = motionText || {};




(function(global){

	var Animator = function(canvas){
		this._objs = [];
		console.log(canvas)
		this.canvas = canvas;
		this.playLength = 3000;
	}
	var now = null;
	Animator.prototype.add = function(obj){
		this._objs.push(obj)
		this.canvas.add(obj.object)
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
			if(obj.timeToAnimate(ds)){
				obj.start();
			}
		}
		//console.log(this.renderFrame)
		
		this.canvas.renderAll()
		if(ds < this.playLength){
			requestAnimationFrame(this.renderFrame.bind(this))
		}
	}
	
	
	
	motionText.Animator = Animator;
})(window)