define(function(require) {
		require('jquery')
		require('jquery.layout')
		require('jquery.ui.all')
		require('jquery.layout.resizePaneAccordions')
		require('app/AObjects')

		require('backbone')
		var AudioTrack = require('app/Audio')
		var Properties = require('app/Properties')
		
		
		var AnimateObjectView = require('app/view/AnimateObjectView')
		
        var fabric = require('fabric')
		var Animator = require('app/Animator')
		var DrawingArea = require('app/DrawingArea')
		var Previewer = require('app/Previewer')
		
		
		$("#add").click(function(){
			
		})
		
		

		myLayout = $('body').layout({
			west__size:			200
		,	east__size:			300
			// RESIZE Accordion widget when panes resize
		,	west__onresize:		$.layout.callbacks.resizePaneAccordions
		,	east__onresize:		$.layout.callbacks.resizePaneAccordions
		, west: {
			   side:'left'
		  ,    cssReq:{    
				  overflow:"auto"
				  ,height:"scroll"  
			   }
		  }
		});

		// ACCORDION - in the West pane
		$("#accordion1").accordion({
			heightStyle: "content",
			collapsible : true
		});
		
			
		
		// ACCORDION - in the East pane - in a 'content-div'
		$("#accordion2").accordion({

		});


		/*
		myLayout = $('body').layout({
			// enable showOverflow on west-pane so popups will overlap north pane
			west__showOverflowOnHover: true
		//,	west__fxSettings_open: { easing: "easeOutBounce", duration: 750 }
		});*/

		
		
		var canvas = new fabric.Canvas('cc');
		var animator = new Animator(canvas,'drawing', 3000);
		var drawingArea = new DrawingArea(canvas, "#drawingArea")
		var audioTrack = new AudioTrack('to_add', animator)
		//var aText = new fabric.AText("Hemant",new Properties())
		//animator.add(aText)
		/*
		var aText = new fabric.AText(
			"Hemant", new Properties()).keyframe(100, 400, new Properties({top : '-200'}), new Properties({top : '100'}),fabric.util.ease.easeOutBounce)
		//.keyframe(500, 800, {angle : {from : '90', to : '0'}},fabric.util.ease.easeOutBounce)
		//.keyframe(1600,3000, { fontSize : {from : 80 , to :  '800'},opacity : {from : 1, to :0}, top: {from : 180, to : 500}, left: { from : 200, to : -500}}, fabric.util.ease.easeOutBounce)
		
		animator.add(aText)
		//aText.saveToStartState();
		aText.on('selected' , function(){
			console.log(this)
		})
animator.play()*/
			
		var camera = new fabric.ARect({
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
			Previewer.preview(Previewer.canvasToJSON(canvas), animator.playLength)
		})
		
		$("#generate").click(function(){
			var lyrics = $("#lyrics").val();
			lyrics = lyrics.replace(/[ \t\r\n]+/g," ");
			var wordList = lyrics.split(" ");
			
			var playLength = parseInt(animator.playLength)
			console.log('playlength', playLength)
			var eachWordDuration = parseInt(playLength/wordList.length)
			var eachWordEnterStartEndDt = parseInt(eachWordDuration * .2)
			console.log('eachWordDuration', eachWordDuration)
			console.log('eachWordEnterStartEndDt', eachWordEnterStartEndDt)
			var timeElapsed = 0
			for(var idx in wordList){
				var word = wordList[idx]
				var text = new fabric.AText(word, new Properties())
				text.on('selected' , function(){
					console.log(this)
				})
				
				var enteringStartTime = timeElapsed
				var enteringEndTime = timeElapsed+eachWordEnterStartEndDt
				var leavingStartTime = timeElapsed + (eachWordDuration-eachWordEnterStartEndDt)
				var leavingEndTime = timeElapsed+eachWordDuration
				
				animator.add(text
					.keyframe(enteringStartTime, enteringEndTime
						,	new Properties({top : '-200', left : '0'})
						,	new Properties({top : '250', left : '150'})
						,	fabric.util.ease.easeOutBounce)
					.keyframe(enteringEndTime, leavingStartTime
						,	new Properties({top : '250', left : '150'})
						,	new Properties({top : '250', left : '150'})
						)
					.keyframe(leavingStartTime, leavingEndTime
						, 	new Properties({top : '250', left : '150'})
						,	new Properties({top : '400', left : '150'})
						,	fabric.util.ease.easeOutBounce)
				)
				timeElapsed = timeElapsed + eachWordDuration;
				audioTrack.addFramesRegion({
					start : enteringStartTime,
					end : leavingEndTime,
					color : "red",
					data : text
				})
				var newDiv = "<h3><a href=\"#\">" + word + " </a></h3><div>New Content</div>";
				$("#accordion1").append(newDiv)
				$("#accordion1").accordion("refresh");    
			
			}
			console.log(animator)
			//animator.play()
		})
			/*
		  new $.Zebra_Accordion('#accordion', {
				'collapsible':  true
			});
	*/

        
    }
);


