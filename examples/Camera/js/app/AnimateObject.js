if (typeof define !== 'function') { 
	var define = require('amdefine')(module)
}
define(function(require) {
	var Keyframe = require('./Keyframe')
	var fabric = require('./Fabric')
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
			var keyframeList = this.get('keyframeList')
			for(var i in keyframeList){
				keyframeList[i]['easeFn'] = 'fabric.util.ease.' + keyframeList[i]['easing'].name
			}
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
			//console.log(this.keyframeList)
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
		updateCoords : function(atTime){
			var keyframe = this.getKeyframeByTime(atTime)
			//console.log('keyframebytime' , keyframe)
			if(keyframe){
			  var propsToAnimate = [ ], prop, skipCallbacks;
			  for (prop in keyframe.properties) {
				propsToAnimate.push(prop);
			  }
			  for (var i = 0, len = propsToAnimate.length; i < len; i++) {
				prop = propsToAnimate[i];
				skipCallbacks = i !== len - 1;
				//console.log('keyframe.easeFn is null ', keyframe.easeFn == null)
				
				var easeFn = function(t, b, c, d) {return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;}
				if(keyframe.easing == null){
					if(keyframe.easeFn != null){
						easeFn = eval(keyframe.easeFn)
					}
				}else{
					easeFn = keyframe.easing
				}
				this._animate2(prop, keyframe.properties[prop]['to'], 
									{	duration : keyframe.endAt - keyframe.startAt,
										startAt : keyframe.startAt,
										endAt : keyframe.endAt,
										seekAt : atTime,
										easing : easeFn,
										onComplete : function(){
											console.log('animation completed')
										},
										from : keyframe.properties[prop]['from']
									}, skipCallbacks);
			  }
			}
		},
		_animate2: function(property, to, options, skipCallbacks) {
			var _this = this, propPair;

			to = to.toString();

			if (!options) {
			  options = { };
			}
			else {
			  options = fabric.util.object.clone(options);
			}
			/* Not clear yet
			if (~property.indexOf('.')) {
			  propPair = property.split('.');
			}

			var currentValue = propPair
			  ? this.get(propPair[0])[propPair[1]]
			  : this.get(property);*/
			  
			//var currentValue = this.get(property);
			//console.log(options)
			if (!('from' in options)) {
			  options.from = currentValue;
			}else{
				options.from  = parseFloat(options.from)
			}

			if (~to.indexOf('=')) {
			  to = currentValue + parseFloat(to.replace('=', ''));
			}
			else {
			  to = parseFloat(to);
			}
			var byValue = to -  options.from;
			console.log('start at' , options.startAt)
			console.log('time' , options.seekAt - options.startAt, 'from : ' , options.from,'to', to,'duraation', options.duration, 'byValue', byValue)
			console.log('easing' , options.easing.name)
			var value = options.easing(options.seekAt - options.startAt, options.from, byValue,  options.duration);
			console.log(options.seekAt - options.startAt, value)
			if (propPair) {
				_this[propPair[0]][propPair[1]] = value;
			}
			else {
			  _this.set(property, value);
			}
			if (skipCallbacks) {
				//return;
			}else{
				options.onChange && options.onChange();
			}
			//_this.setCoords();
			/*
			fabric.util.animate({
			  startValue: options.from,
			  endValue: to,
			  easing: options.easing,
			  duration: options.duration,
			  abort: options.abort && function() {
				return options.abort.call(_this);
			  },
			  onChange: function(value) {
				if (propPair) {
				  _this[propPair[0]][propPair[1]] = value;
				}
				else {
				  _this.set(property, value);
				}
				if (skipCallbacks) {
				  return;
				}
				options.onChange && options.onChange();
			  },
			  onComplete: function() {
				console.log('oncomplete called', options)
				if (skipCallbacks) {
				  return;
				}

				_this.setCoords();
				console.log('going to call oncomplete')
				options.onComplete && options.onComplete();
			  }
			});*/
		  },
		start : function(time){
			var keyframe = this.getKeyframeByTime(time)
//			console.log('keyframebytime' , keyframe)
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