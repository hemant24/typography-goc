var motionText = motionText || {};




(function(global){

	var Previewer = function(){
	}

	Previewer['preview'] = function(canvas){
		$('#previewArea').modal({})
		var newCanvas = new fabric.Canvas('previewCanvas');
		newCanvas.loadFromJSON(canvas.toJSON(), function(){
			newCanvas.renderAll()
		})
	}
	
	
	
	motionText.Previewer = Previewer;
})(window)