define(function(require) {

		require('jquery.layout')
		require('jquery.ui.all')
		require('jquery')
		require('app/AObjects')

        var fabric = require('fabric')
		var Animator = require('app/Animator')
		var DrawingArea = require('app/DrawingArea')
		var Previewer = require('app/Previewer')
		
		
		
		
		myLayout = $('body').layout({
			// enable showOverflow on west-pane so popups will overlap north pane
			west__showOverflowOnHover: true
		//,	west__fxSettings_open: { easing: "easeOutBounce", duration: 750 }
		});

		
		
		var canvas = new fabric.Canvas('cc');
		var animator = new Animator(canvas);
		var drawingArea = new DrawingArea(canvas, "#drawingArea")
		
		var aText = new fabric.AText(
			"Hemant", {
			  left: 200,
			  top: -200,
			  fontFamily: 'Impact',
			  fill   : 'rgb(0,200,0)',
			  angle : 90,
			  fontSize: 80
		}).keyframe(100, 400, {top : {from : '-200', to : '130'}},fabric.util.ease.easeOutBounce)
		.keyframe(500, 800, {angle : {from : '90', to : '0'}},fabric.util.ease.easeOutBounce)
		.keyframe(1600,3000, { fontSize : {from : 80 , to :  '800'},opacity : {from : 1, to :0}, top: {from : 180, to : 500}, left: { from : 200, to : -500}}, fabric.util.ease.easeOutBounce)
		
		animator.add(aText)
		aText.saveToStartState();
		aText.on('selected' , function(){
			console.log(this)
		})

			
		var camera = new fabric.ARect({
		  left: 100,
		  top: 100,
		  fill: null,
		  stroke: "red",
		  strokeWidth: 3,
		  width: 300,
		  height: 300
		})//.keyframe(800, 900, {left : 170});
		camera.lockScalingX = true;
		camera.lockScalingY = true;
		camera.lockRotation = true;
		camera.saveToStartState();

		animator.add(camera)
		
		
		//animator.play();
		
		$("#seekBtn").click(function(){
			animator.seek( $("#seekTime").val())
			
		})
		
		$("#preview").click(function(){
			console.log(JSON.stringify(Previewer.canvasToJSON(canvas)))
			Previewer.preview(Previewer.canvasToJSON(canvas))
		})


        
    }
);


