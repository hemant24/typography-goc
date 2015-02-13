var THREE = require('../../')

var fs = require('fs')
  , jsdom = require('jsdom').jsdom
  , document = jsdom('<!doctype html><html><head></head><body></body></html>')
  , window = document.parentWindow;

var camera, scene, renderer;
var geometry, material, mesh;


init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    //renderer.setSize(window.innerWidth, window.innerHeight);
	
	
    //document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
	var stream = renderer.domElement.createPNGStream()
	var path = __dirname + '/frame-' + (++curFrame) + '.png'
    , out = fs.createWriteStream(path);

	  console.log('Writing... (%s)', curFrame);
	  stream.pipe(out);
}