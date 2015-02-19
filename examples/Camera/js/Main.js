var motionText = motionText || {};




(function(global){

var canvas = new fabric.Canvas('cc');
var animator = new motionText.Animator(canvas);
var drawingArea = new motionText.DrawingArea(canvas, "#drawingArea")


animator.add( new motionText.AnimateObject(new fabric.Text(
"Hemant", {
  left: 120,
  top: 100,
  fontFamily: 'Impact',
  fill   : 'rgb(0,200,0)',
  fontSize: 80
}))
.keyframe(100, 200, {angle : '90'},fabric.util.ease.easeOutBounce)
.keyframe(300, 400, {left : '300'},fabric.util.ease.easeOutBounce)
.keyframe(500, 800, {angle : '0'},fabric.util.ease.easeOutBounce)
.keyframe(800, 900, {left : '320'},fabric.util.ease.easeOutBounce)
);

animator.add(  new motionText.AnimateObject(new fabric.Text(
"Sachdeva",
{
  left: 100,
  top: -100,
   fontFamily: 'Impact',
	fill : '#c3bfbf',
   fontSize: 80

}))
.keyframe(100, 300, {top : 100},fabric.util.ease.easeOutBounce)
.keyframe(800, 1100, {left : 0},fabric.util.ease.easeOutBounce)
)
;

/*
aObj1.from = 0
aObj1.to = 2000
aObj1.endProperties = {angle : 90}
*/
//animator.add(aObj1);
/*
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

//var cameraFrame = new fabric.Path('M 0 0 L 0 100  ');
//cameraFrame.set({ fill: null, stroke: 'green', opacity: 0.5 });


var cameraFrame = new fabric.Rect({
  left: 100,
  top: 100,
  fill: null,
  stroke: "red",
  strokeWidth: 3,
  width: 300,
  height: 300
});
cameraFrame.lockScalingX = true;
cameraFrame.lockScalingY = true;
cameraFrame.lockRotation = true;

console.log('cameraFrame' , cameraFrame)
var aObj4 = new motionText.AnimateObject();
aObj4.object = cameraFrame;

//animator.add(aObj2);
//animator.add(aObj3);
//animator.add(aObj4)
*/
/*
canvas.sendBackwards(myObject)
canvas.sendToBack(myObject)
canvas.bringForward(myObject)
canvas.bringToFront(myObject)

//canvas.preserveObjectStacking = true
canvas.sendToBack(cameraFrame)*/

animator.play();
	
	
$("#preview").click(function(){
	motionText.Previewer.preview(canvas)
})
	

})(window)