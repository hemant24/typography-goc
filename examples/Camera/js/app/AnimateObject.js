if (typeof define !== 'function') { 
	var define = require('amdefine')(module)
}
define(function(require) {
	var Keyframe = require('./Keyframe')
	return {
		initialize: function() {
			var text="defalt" ,options={}
			if(arguments.length == 2){
				text = arguments[0]
				options = arguments[1]
				this.callSuper('initialize', text, options);
			}else{
				options = arguments[0]
				this.callSuper('initialize', options);
			}
			this.keyframeList = options.keyframeList || [];
			this.startState = options.startState || {};
			return this;
		},
		show : function(){
			console.log('I am custom class')
		},
		saveToStartState : function(){
			 this.stateProperties.forEach(function(prop) {
			  this.startState[prop] = this.get(prop);
			}, this);
		},
		toObject: function() {
			return fabric.util.object.extend(this.callSuper('toObject'), {
			  keyframeList: this.get('keyframeList')
			});
		},
		keyframe :  function(startTime, endTime, properties, easing){
			this.keyframeList.push( new Keyframe(startTime, endTime, properties, easing));
			return this;
		},
		timeToAnimate : function(time){
			var keyframe = this.getKeyframeByTime(time)
			//console.log(keyframe)
			if(keyframe == null){
				return false;
			}else{
				return true;
			}
		},
		getKeyframeByTime : function(time){
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
		},
		start : function(time){
			var keyframe = this.getKeyframeByTime(time)
			console.log('keyframebytime' , keyframe)
			if(keyframe && !keyframe.running){
				console.log('goingt to animate', this, keyframe.properties, keyframe.startAt, keyframe.endAt)
				this.animate(keyframe.properties, {
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
	  
  }
  });