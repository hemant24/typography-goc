var THREE = require('../../')
var nodejs=true,
    WebGL = require('../../webgl.js')
	
    , document = WebGL.document();
	//console.log(document)
var fs = require('fs')
  , jsdom = require('jsdom').jsdom
  //, document = jsdom('<!doctype html><html><head></head><body></body></html>')
  , window = document.parentWindow;
var alert=console.error;
var shaders= {
    "shader-fs" : 
      [ "#ifdef GL_ES",
        "  precision mediump float;",
        "#endif",
        "varying vec4 vColor;",
        "",
        "void main(void) {",
        "    gl_FragColor = vColor;",
        "}" ].join("\n"),

        "shader-vs" : 
          [ "attribute vec3 aVertexPosition;",
            "attribute vec4 aVertexColor;",
            "",
            "uniform mat4 uMVMatrix;",
            "uniform mat4 uPMatrix;",
            "",
            "varying vec4 vColor;",
            "",
            "void main(void) {",
            "    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
            "    vColor = aVertexColor;",
            "}" ].join("\n")
};
var container, stats;

			var camera, scene, renderer;

			var mesh;
eval(fs.readFileSync(__dirname+ '/glMatrix-0.9.5.min.js','utf8'));
function getShader(gl, id) {
  var shader;
  if(nodejs) {
    if (!shaders.hasOwnProperty(id)) return null;
    var str = shaders[id];

    if (id.match(/-fs/)) {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (id.match(/-vs/)) {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else { return null; }

  }
  else {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

var shaderProgram;

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;
var squareVertexPositionBuffer;
var squareVertexColorBuffer;

function initBuffers() {
  triangleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  var vertices = [
                  0.0,  1.0,  0.0,
                  -1.0, -1.0,  0.0,
                  1.0, -1.0,  0.0
                  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  triangleVertexPositionBuffer.itemSize = 3;
  triangleVertexPositionBuffer.numItems = 3;

  triangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  var colors = [
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0
                ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  triangleVertexColorBuffer.itemSize = 4;
  triangleVertexColorBuffer.numItems = 3;


  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  vertices = [
              1.0,  1.0,  0.0,
              -1.0,  1.0,  0.0,
              1.0, -1.0,  0.0,
              -1.0, -1.0,  0.0
              ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  squareVertexPositionBuffer.itemSize = 3;
  squareVertexPositionBuffer.numItems = 4;

  squareVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  colors = []
  for (var i=0; i < 4; i++) {
    colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  squareVertexColorBuffer.itemSize = 4;
  squareVertexColorBuffer.numItems = 4;
}



function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  mat4.identity(mvMatrix);

  mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

  mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);

}




			init();
			animate();

			function init() {
			var canvas = document.createElement("lesson02-canvas");
			 
			  try {
    var gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
	console.log("resize "+canvas.width+" x "+canvas.height);
	//console.log(gl)
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
  
			
				renderer = new THREE.WebGLRenderer( { antialias: false, clearColor: 0x333333, clearAlpha: 1, alpha: false, canvas : canvas } );
				//

				camera = new THREE.PerspectiveCamera( 27, canvas.width / canvas.height, 5, 3500 );
				camera.position.z = 2750;

				scene = new THREE.Scene();
				scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

				//

				var particles = 500000;

				var geometry = new THREE.BufferGeometry();
				geometry.attributes = {

					position: {
						itemSize: 3,
						array: new Float32Array( particles * 3 )
					},
					color: {
						itemSize: 3,
						array: new Float32Array( particles * 3 )
					}

				}


				var positions = geometry.attributes.position.array;
				var colors = geometry.attributes.color.array;

				var color = new THREE.Color();

				var n = 1000, n2 = n / 2; // particles spread in the cube

				for ( var i = 0; i < positions.length; i += 3 ) {

					// positions

					var x = Math.random() * n - n2;
					var y = Math.random() * n - n2;
					var z = Math.random() * n - n2;

					positions[ i ]     = x;
					positions[ i + 1 ] = y;
					positions[ i + 2 ] = z;

					// colors

					var vx = ( x / n ) + 0.5;
					var vy = ( y / n ) + 0.5;
					var vz = ( z / n ) + 0.5;

					color.setRGB( vx, vy, vz );

					colors[ i ]     = color.r;
					colors[ i + 1 ] = color.g;
					colors[ i + 2 ] = color.b;

				}

				geometry.computeBoundingSphere();

				//

				var material = new THREE.ParticleBasicMaterial( { size: 15, vertexColors: true } );

				particleSystem = new THREE.ParticleSystem( geometry, material );
				scene.add( particleSystem );

				//

				//renderer = new THREE.WebGLRenderer( { antialias: false, clearColor: 0x333333, clearAlpha: 1, alpha: false } );
				renderer.setSize(canvas.width , canvas.height );
				renderer.setClearColor( scene.fog.color, 1 );

				//container.appendChild( renderer.domElement );

				
				//window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//
var curFrame = 0
			function animate() {

				requestAnimationFrame( animate );

				render();
				

			}

			function render() {

				var time = Date.now() * 0.001;

				particleSystem.rotation.x = time * 0.25;
				particleSystem.rotation.y = time * 0.5;

				renderer.render( scene, camera );
				var stream = renderer.domElement.createPNGStream()
	var path = __dirname + '/frame-' + (++curFrame) + '.png'
    , out = fs.createWriteStream(path);

	  console.log('Writing... (%s)', curFrame);
	  stream.pipe(out);

			}