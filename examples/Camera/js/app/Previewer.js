if (typeof define !== 'function') { 
	var define = require('amdefine')(module)
}
define(function(require) {

	require('./AObjects')
	var Animator = require('./Animator')
	var env = require('./Env')
	
	
	var fabric = require('./Fabric')

	var Previewer = function(){
	}
	
	var previewCanvas = null;
	
	Previewer['canvasToJSON'] = function(canvas){
		var initialStateObjects = []
		initialStateObjects = canvas.getObjects().map(function(instance){
			var clonnedInstance = fabric.util.object.clone(instance)
			var clonnedObject = clonnedInstance.toObject()
			console.log('clonnedObject', clonnedObject)
			console.log('clonnedInstance.stateProperties', clonnedInstance.stateProperties)
			fabric.util.populateWithProperties(clonnedInstance.startState, clonnedObject , clonnedInstance.stateProperties)
			return clonnedObject
		}, canvas)
		return {background : '' , objects : initialStateObjects}
	}
	
	Previewer['preview'] = function(canvasJSON){
		var animateFor = 'preview'
		//console.log('initiating canvas with' , canvasJSON)
		console.log('evn is ' , env)
		if(env == 'node'){
			animateFor = 'server';
			previewCanvas = fabric.createCanvasForNode(1500, 1500);
		}else{
			previewCanvas = new fabric.Canvas('previewCanvas');
		}
		var animator = new Animator(previewCanvas, animateFor);
		previewCanvas.loadFromJSON(canvasJSON, function(){
			//console.log('called loadFromJSON complete')
			//console.log(animator)
			//previewCanvas.setZoom(2)
			animator.play()
			//animator.seek( $("#seekTime").val())
			//previewCanvas.renderAll();
			//startAnimation();
		}, function(o, object){
			animator.add(object)
		} )
	}
	
	
	
	return Previewer;
  });