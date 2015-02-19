var motionText = motionText || {};

(function(global){

	var AnimateObject = function(fabricObject){
		//this.from = 0;
		//this.to = 2000;
		this.object = fabricObject;
		this.startProperties = {},
		this.endProperties = {},
		this.easing = fabric.util.ease.easeOutBounce
		this.running = false,
		this.keyframeList = []
		return this;
	}
	
	AnimateObject.prototype.keyframe = function(startTime, endTime, properties, easing){
		this.keyframeList.push( new motionText.Keyframe(startTime, endTime, properties, easing));
		return this;
	}
	
	
	
	AnimateObject.prototype.timeToAnimate = function(time){
		var keyframe = this.getKeyframeByTime(time)
		//console.log(keyframe)
		if(keyframe == null){
			return false;
		}else{
			return true;
		}
	}
	
	AnimateObject.prototype.getKeyframeByTime = function(time){
		console.log(this.keyframeList)
		for(var i in this.keyframeList){
			var keyframe = this.keyframeList[i]
			/*console.log(keyframe)
			console.log('time', time)
			console.log('keyframe.startAt' , keyframe.startAt)
			console.log('keyframe.endAt' , keyframe.endAt)
			console.log(time >= keyframe.startAt && time <= keyframe.endAt)*/
			if(time >= keyframe.startAt && time <= keyframe.endAt){
				return keyframe;
			}
		}
		return null;
	}
	
	AnimateObject.prototype.start = function(time){
		var keyframe = this.getKeyframeByTime(time)
		console.log('keyframebytime' , keyframe)
		if(keyframe && !keyframe.running){
			console.log('goingt to animate', this.object, keyframe.properties, keyframe.startAt, keyframe.endAt)
			this.object.animate(keyframe.properties, {
			  duration: keyframe.endAt - keyframe.startAt,
			  easing : keyframe.easing,
			  onComplete : function(){
				console.log('on complete called', this)
				keyframe.running = false;
			  }
			});
			keyframe.running = true;	
		}
	}
	motionText.AnimateObject = AnimateObject;
})(window)