var motionText = motionText || {};

(function(global){

	var AnimateObject = function(){
		this.from = 0;
		this.to = 2000;
		this.object = {};
		this.startProperties = {},
		this.endProperties = {},
		this.easing = fabric.util.ease.easeOutBounce
		this.running = false
	}
	AnimateObject.prototype.timeToAnimate = function(time){
		if(this.from <= time){
			return true;
		}else{
			return false;
		}
	}
	
	AnimateObject.prototype.start = function(){
		//console.log('inside start')
		//console.log(this.object)
		//console.log(started)
		if(!this.running){
			console.log('goingt to animate')
			this.object.animate(this.endProperties, {
			  duration: this.to - this.from,
			  easing : this.easing
			});
			this.running = true;	
		}
		
	}
	motionText.AnimateObject = AnimateObject;
})(window)