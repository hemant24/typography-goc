var motionText = motionText || {};




(function(global){

var canvas = new fabric.Canvas('cc');
var animator = new motionText.Animator(canvas);
var drawingArea = new motionText.DrawingArea(canvas, "#drawingArea")

var text1 = new fabric.Text(
"Hemant",
{
  left: 120,
  top: 100,
  fontFamily: 'Impact',
  fill   : 'rgb(0,200,0)',
  fontSize: 80
});

var aObj1 = new motionText.AnimateObject();
aObj1.from = 0
aObj1.to = 2000
aObj1.object = text1
aObj1.endProperties = {angle : 90}

animator.add(aObj1);

var text2 = new fabric.Text(
"Sachdeva",
{
  left: 100,
  top: -100,
   fontFamily: 'Impact',
	fill : '#c3bfbf',
   fontSize: 80

});

var aObj2 = new motionText.AnimateObject();
aObj2.from = 1000
aObj2.to = 2000
aObj2.object = text2
aObj2.endProperties = {top: 80}

var aObj3 = new motionText.AnimateObject();
aObj3.from = 2000
aObj3.to = 3000
aObj3.object = text2
aObj3.endProperties = {fontSize : 40}

animator.add(aObj2);
animator.add(aObj3);
animator.play();
	
	
$("#preview").click(function(){
	motionText.Previewer.preview(canvas)
})
	

})(window)