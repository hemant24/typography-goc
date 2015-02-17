/**
 * Module dependencies.
 */

var THREE = require('../../')
  , EventEmitter = require('events').EventEmitter
  , jsdom = require('jsdom').jsdom
  , document = jsdom('<!doctype html><html><head></head><body></body></html>')
  , fs = require('fs')
  , window = document.parentWindow;
  
  var width = 1024, height = 768
 
 function init(){
 canvas1 = document.createElement('canvas');
  canvas1.width = 1900;
  canvas1.height = 400;
  var context1 = canvas1.getContext('2d');
  context1.font =  "Bold 40px Arial";
  context1.fillStyle = "rgba(255,0,0,0.95)";
  context1.fillText('Hello World', 0, 50);
  var texture1 = new THREE.Texture(canvas1)
  texture1.needsUpdate = true;
 // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render and set the size
        var renderer = new THREE.CanvasRenderer();
        //renderer.setClearColorHex()
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // show axes in the screen
        var axes = new THREE.AxisHelper( 20 );
        scene.add(axes);

        // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(60,20);
        var planeMaterial = new THREE.MeshBasicMaterial({map: texture1, side:THREE.DoubleSide });
        var plane = new THREE.Mesh(planeGeometry,planeMaterial);

        // rotate and position the plane
        //plane.rotation.x=-0.5*Math.PI;
        plane.position.x=15
        plane.position.y=0
        plane.position.z=-10

        // add the plane to the scene
        scene.add(plane);

        // create a cube
        var cubeGeometry = new THREE.CubeGeometry(4,4,4);
        var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        // position the cube
        cube.position.x=-4;
        cube.position.y=3;
        cube.position.z=0;

        // add the cube to the scene
        scene.add(cube);

        // create a sphere
        var sphereGeometry = new THREE.SphereGeometry(4,20,20);
        var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
        var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

        // position the sphere
        sphere.position.x=20;
        sphere.position.y=4;
        sphere.position.z=2;

        // add the sphere to the scene
        scene.add(sphere);

        // position and point the camera to the center of the scene
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 10;
        camera.lookAt(scene.position);

       
       

       
        // render the scene
        renderer.render(scene, camera);
		var stream = renderer.domElement.createPNGStream()
		var path = __dirname + '/frame-1'+ '.png'
			, out = fs.createWriteStream(path);
		  stream.pipe(out);
		  
 }
 
 init();