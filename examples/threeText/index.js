
/**
 * Module dependencies.
 */

var THREE = require('../../')
  , EventEmitter = require('events').EventEmitter
  , jsdom = require('jsdom').jsdom
  , document = jsdom('<!doctype html><html><head></head><body></body></html>')
  , window = document.parentWindow
  , fs = require('fs')
  , canvas1

/**
 * Expose `Particles`.
 */

module.exports = Particles;

/**
 * `Particles` constructor.
 *
 * @param {Number} width
 * @param {Number} height
 * @param {Number} fps
 */
function getPowerOfTwo(value, pow) {
	var pow = pow || 1;
	while(pow<value) {
		pow *= 2;
	}
	return pow;
}
function Particles(width, height, fps) {






  canvas1 = document.createElement('canvas');
  canvas1.width = 1000;
  canvas1.height = 1000;
  var context1 = canvas1.getContext('2d');
  context1.font = "Bold 400px Helvetica";
  context1.fillStyle = "rgba(255,0,0,0.95)";
  context1.fillText('Hemant', 0, 300);
  
  
  
  
  // canvas contents will be used for a tex
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        this.scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

        // create a render and set the size
        this.renderer = new THREE.CanvasRenderer();
        this.renderer.setClearColorHex()
        this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
        this.renderer.setSize(width, height);

        // show axes in the screen
        var axes = new THREE.AxisHelper( 20 );
        this.scene.add(axes);
	  var texture1 = new THREE.Texture(canvas1)
	  texture1.needsUpdate = true;
        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(40,40);
        var planeMaterial = new THREE.MeshBasicMaterial({map: texture1, side:THREE.DoubleSide });
		 //planeMaterial.transparent = true;
        var plane = new THREE.Mesh(planeGeometry,planeMaterial);

        // rotate and position the plane
        plane.rotation.x=-0.5*Math.PI;
        plane.position.x=-12
        plane.position.y=0
        plane.position.z=0

        // add the plane to the scene
        this.scene.add(plane);



//this.camera.position.set(0,50,40);
        // position and point the camera to the center of the scene
        this.camera.position.x = -30;
        this.camera.position.y = 40;
        this.camera.position.z = 2;
        this.camera.lookAt(this.scene.position);
		
		
  
  
  
  
  
  EventEmitter.call(this);
  
  
}

/**
 * Inherits from `EventEmitter`.
 */

Particles.prototype.__proto__ = EventEmitter.prototype;

/**
 * Start rendering.
 */

Particles.prototype.play = function() {
  //this.timer = setInterval(this.render.bind(this), 1000 / this.fps);
  this.animate.call(this);
  
};

Particles.prototype.animate = function() {
//console.log('called')
    requestAnimationFrame(this.animate.bind(this));
	this.render.call(this)
}
/**
 * Pause rendering.
 */

Particles.prototype.pause = function() {
  clearInterval(this.timer);
};

/**
 * Program for particle.
 */

Particles.prototype.program = function(context) {
  context.beginPath();
  context.arc(0, 0, 1, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
};

/**
 * Rendering.
 */

Particles.prototype.render = function() {
  this.camera.lookAt(this.scene.position);
  
  //this.group.rotation.x += 0.01;
  //this.group.rotation.y += 0.02;
  
  this.renderer.render(this.scene, this.camera);
  //this.renderer.domElement.getContext('2d').drawImage(canvas1,0,0);
  this.emit('render', this.renderer.domElement.createPNGStream());
};


var particles = new Particles(1024, 768, 15)
, curFrame = 0

particles.play();

particles.on('render', function(stream) {
  var path = __dirname + '/frame-' + (++curFrame) + '.png'
    , out = fs.createWriteStream(path);

  //console.log('Writing... (%s/%s)', curFrame, maxFrame);
  stream.pipe(out);
	console.log('runnin....')
  /*if (curFrame >= maxFrame) {
    particles.pause();
  }*/
});

