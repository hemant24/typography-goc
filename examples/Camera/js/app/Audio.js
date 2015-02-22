if (typeof define !== 'function') { 
	var define = require('amdefine')(module)
}
define(function(require) {
	require('jquery')
	var WaveSurfer = require('wavesurfer');
	require('util');
	require('drawer');
	require('drawer.canvas');
	require('webaudio');
	require('wavesurfer.timeline');
	require('wavesurfer.regions');
	var wavesurfer = Object.create(WaveSurfer);

		wavesurfer.init({
			container: document.querySelector('#wave'),
			waveColor: 'violet',
			progressColor: 'purple',
			cursorWidth : 3,
			scrollParent : true,
			minPxPerSec : 100
		});

		wavesurfer.on('ready', function () {
			//wavesurfer.play();
			var timeline = Object.create(WaveSurfer.Timeline);
			timeline.init({
				wavesurfer: wavesurfer,
				container: "#wave-timeline"
			});
			
			timeline.on('click', function(percentage){
				wavesurfer.seekTo(percentage);
			})
		
		});
		
		wavesurfer.drawer.on('click', function(e, progress){
			console.log('click', e, progress)
		
		})
	
		wavesurfer.enableDragSelection({
			color: randomColor(0.1)
		});
		
		
		
		wavesurfer.load('assets/demo.mp3');
		
		$("#playPause").click(function(){
			wavesurfer.playPause()
		})
		
		function randomColor(alpha) {
			return 'rgba(' + [
				~~(Math.random() * 255),
				~~(Math.random() * 255),
				~~(Math.random() * 255),
				alpha || 1
			] + ')';

		}
		return WaveSurfer
});