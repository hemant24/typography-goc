if (typeof define !== 'function') { 
	var define = require('amdefine')(module)
}
define(function(require) {
	var events = require('events');
	var EventEmitter = require("events").EventEmitter;
	var util = require('util');
	
	var Sequence = function(start, end, delta){
		events.EventEmitter.call(this);
		this.start = start || 0 ;
		this.end = end || 100  ;
		this.delta = delta || 1 ;
		this.current = this.start - this.delta;
	}
	
	util.inherits(Sequence, EventEmitter);
	Sequence.prototype.next = function(){
		this.current = this.current + this.delta;
		if(this.current > this.end){
			return null;
		}

		return this.current;
	}
	
	
	
	return Sequence
});