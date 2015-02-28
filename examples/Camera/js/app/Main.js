define(function(require) {
		require('jquery')
		require('jquery.layout')
		require('jquery.ui.all')
		require('jquery.layout.resizePaneAccordions')
		require('app/AObjects')

		require('backbone')
		require('app/view/TransitionItemView');
		var AudioTrack = require('app/Audio')
		var Properties = require('app/Properties')
		
		
		var AnimateObjectView = require('app/view/AnimateObjectView')
		
        var fabric = require('fabric')
		var Animator = require('app/Animator')
		var DrawingArea = require('app/DrawingArea')
		var Previewer = require('app/Previewer')
		
		var Transition = require('./Transition');
		var PropertyTransition = require('./PropertyTransition');
		//var TransitionView = require('app/view/TransitionView');
		
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
		var transition1 = new Transition({from : 100 , to : 400})
							.addPropertyTransition(new PropertyTransition({name : 'top', from : '-200', to : '100'}))
							.addPropertyTransition(new PropertyTransition({name : 'left', from : '0', to : '100'}))
		var transition2 = new Transition({from : 500 , to : 800})
							.addPropertyTransition(new PropertyTransition({name : 'angle', from : '90', to : '0'}))
		var transitions = []
		transitions.push(transition1)
		transitions.push(transition2)
	
		var aText = new fabric.AText("Hemant",new Properties({angle : 90}))
		//animator.add(aText)
		aText.addTransitions(transitions)
		//animator.play()
		console.log(aText.getKeyframeByTime2(200))
		
		canvas.add(new fabric.Line([0, -1000, 0, 1000], {
			stroke: 'black',
			selectable  : false
		}));
		
		canvas.add(new fabric.Line([-1000,0, 1000, 0], {
			stroke: 'black',
			selectable  : false
		}));

				
				
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
		  left : 100,
		  fill: null,
		  stroke: "red",
		  strokeWidth: 3,
		  width: 300,
		  height: 300,
		  perPixelTargetFind  : true
		})//.keyframe(800, 900, {left : 170});
		camera.lockScalingX = true;
		camera.lockScalingY = true;
		camera.lockRotation = true;
		camera.saveToStartState();

		canvas.add(camera)
		
		
		//animator.play();
		
		$("#seekBtn").click(function(){
			console.log("seeking to " ,  $("#seekTime").val())
			animator.seek( $("#seekTime").val())
			
		})
		
		$("#add").click(function(){
		
			audioTrack.addFramesRegion({
					start : 100,
					end : 800,
					color : "red",
					data : aText
				})
		})
		
		$("#preview").click(function(){
			console.log('going to call previwer')
			console.log(JSON.stringify(Previewer.animatorToJSON(animator, canvas)))
			//console.log(JSON.stringify(Previewer.canvasToJSON(canvas)))
			Previewer.preview(JSON.stringify(Previewer.animatorToJSON(animator, canvas)), 2000 )//animator.playLength)
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
					.addTransition( new Transition({from : enteringStartTime , to : enteringEndTime})
							.addPropertyTransition(new PropertyTransition({name : 'top', from : '-200', to : '250'}))
							.addPropertyTransition(new PropertyTransition({name : 'left', from : '0', to : '150'})))
					.addTransition( new Transition({from : enteringEndTime , to : leavingStartTime})
							.addPropertyTransition(new PropertyTransition({name : 'top', from : '250', to : '250'}))
							.addPropertyTransition(new PropertyTransition({name : 'left', from : '150', to : '150'})))
					.addTransition( new Transition({from : leavingStartTime , to : leavingEndTime})
							.addPropertyTransition(new PropertyTransition({name : 'top', from : '250', to : '400'}))
							.addPropertyTransition(new PropertyTransition({name : 'left', from : '150', to : '150'})))
					/*
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
						,	fabric.util.ease.easeOutBounce)*/
				)
				timeElapsed = timeElapsed + eachWordDuration;
				audioTrack.addFramesRegion({
					start : enteringStartTime,
					end : leavingEndTime,
					color : "red",
					data : text
				})
				/*
				var newDiv = "<h3><a href=\"#\">" + word + " </a></h3><div>New Content</div>";
				$("#accordion1").append(newDiv)
				$("#accordion1").accordion("refresh");    */
			
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


