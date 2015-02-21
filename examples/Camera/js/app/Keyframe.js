if (typeof define !== 'function') { 
	var define = require('amdefine')(module)
}
define(function(require) {

	var Keyframe = function(startAt, endAt, properties, easing){
		this.startAt = startAt || 0;
		this.endAt = endAt || 0;
		this.properties = properties || {};
		this.easing = easing || '';
		this.running = false;
	}
	
	return Keyframe ;
  });