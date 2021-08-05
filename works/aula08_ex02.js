import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
//import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        createGroundPlane,
        createLightSphere,        
        onWindowResize, 
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information  var renderer = initRenderer();    // View function in util/utils
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(2.5, 2.0, 4.5);
  camera.up.set( 0, 1, 0 );

var ambientLight = new THREE.AmbientLight("rgb(100, 100, 100)");
scene.add(ambientLight);

var lightPosition = new THREE.Vector3(2.5, 1.8, 0.0);
  var light = new THREE.SpotLight(0xffffff);
  light.position.copy(lightPosition);
  light.castShadow = true;
  light.penumbra = 0.5;    
scene.add(light);

var lightSphere = createLightSphere(scene, 0.1, 10, 10, lightPosition);  

// Set angles of rotation
var angle = 0;
var speed = 0.01;
var animationOn = false; // control if animation is on or of

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

//-- Scene Objects -----------------------------------------------------------
// Ground
var groundPlane = createGroundPlane(5.0, 5.0, 100, 100); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
  groundPlane.position.set(0.0, -0.01, 0.0); // to avoid conflict with the cube and the helper
scene.add(groundPlane);

// Cylinder
var cylinderGeometry = new THREE.CylinderGeometry( 0.5, 0.5, 1.0, 64, 64, true );
var cylinderMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
cylinder.position.set(0.0, 0.5, 0.0);
cylinder.castShadow = true;
//cylinder.receiveShadow = true;
scene.add( cylinder );

// Cylinder Lid
var lidGeometry = new THREE.CircleGeometry( 0.5, 64 );
//var lidMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
var lidMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
// top
var topLid = new THREE.Mesh( lidGeometry, lidMaterial );
topLid.position.set(0.0, 0.5, 0.0);
topLid.rotateX(degreesToRadians(-90));
// bottom
var bottomLid = new THREE.Mesh( lidGeometry, lidMaterial );
bottomLid.position.set(0.0, -0.5, 0.0);
bottomLid.rotateX(degreesToRadians(90));

//scene.add( circle );
cylinder.add(topLid);
cylinder.add(bottomLid);

// New cube
// Define cube materials
/*var cubeFaceGeometry = new THREE.PlaneGeometry(1.0, 1.0, 10.0, 10.0);
var cubeMaterial = new THREE.MeshLambertMaterial({
  side: THREE.DoubleSide
});
// Define cube faces
var cubeFaces = [];
var numFaces = 5;
for (let i = 0; i < numFaces; i++) {
  cubeFaces[i] = new THREE.Mesh(cubeFaceGeometry, cubeMaterial);
  cubeFaces[i].castShadow = true;
  cubeFaces[i].receiveShadow = true;
}

// Placement of the faces
cubeFaces[0].position.set(0.0, 0.5, 0.0); // 0.51 to avoid conflict with ground plane
cubeFaces[1].position.set(0.0, 0.0, -1.0);

cubeFaces[2].position.set(0.0, 0.5, 0.5);
cubeFaces[2].rotateX(degreesToRadians(-90));

cubeFaces[3].position.set(0.0, 0.0, -1.0);

cubeFaces[4].position.set(-0.5, 0.0, 0.5);
cubeFaces[4].rotateY(degreesToRadians(90));

// Add them to the scene
scene.add(cubeFaces[0]); // add the face zero
for (let i = 0; i < numFaces - 1; i++) { // numFaces - 1 because of the last one
  cubeFaces[i].add(cubeFaces[i+1]);  
}*/

// Teapot
/*var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)", shininess:"100"});
  material.side = THREE.DoubleSide;
var teapot = new THREE.Mesh(geometry, material);
  teapot.castShadow = true;
  teapot.position.set(0.0, 0.5, -0.6);
scene.add(teapot);*/

// Cube
/*var cubeSize = 0.6;
var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
var cubeMaterial = new THREE.MeshLambertMaterial();
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.position.set(0.0, cubeSize/2, 1.0);
scene.add(cube);*/

//----------------------------------------------------------------------------
//-- Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var floor  = textureLoader.load('../assets/textures/floor-wood.jpg');
var glass  = textureLoader.load('../assets/textures/glass.png');
var stone = textureLoader.load('../assets/textures/stone.jpg');
var sun = textureLoader.load('../assets/textures/sun.jpg');
var newCube = textureLoader.load('../assets/textures/marble.png'); // loads the new cube's texture
var cylinderBody = textureLoader.load('../assets/textures/wood.png'); // loads the cylinder's texture
var cylinderLid = textureLoader.load('../assets/textures/woodtop.png'); // loads the cylinder lids' texture

// Apply texture to the 'map' property of the respective materials' objects
groundPlane.material.map = floor;
//teapot.material.map = glass;
//cube.material.map = stone;
lightSphere.material.map = sun;
//cubeFaces[0].material.map = newCube; // apply the marble texture to the new cube
cylinder.material.map = cylinderBody;
topLid.material.map = cylinderLid;
bottomLid.material.map = cylinderLid;

buildInterface();
render();

function rotateLight()
{
  // Set angle's animation speed
  if(animationOn)
  {
    // More info:
    light.matrixAutoUpdate = false;
    lightSphere.matrixAutoUpdate = false;      

    angle+=speed;

    var mat4 = new THREE.Matrix4();

    // Will execute T1 and then R1
    light.matrix.identity();  // reset matrix
    light.matrix.multiply(mat4.makeRotationY(angle)); // R1
    light.matrix.multiply(mat4.makeTranslation(lightPosition.x, lightPosition.y, lightPosition.z)); // T1

    lightSphere.matrix.copy(light.matrix);
  }
}

function buildInterface()
{
  //------------------------------------------------------------
  // Interface
  var controls = new function ()
  {
    this.viewAxes = false;
    this.speed = speed;
    this.animation = animationOn;

    this.onViewAxes = function(){
      axesHelper.visible = this.viewAxes;
    };
    this.onEnableAnimation = function(){
      animationOn = this.animation;
    };
    this.onUpdateSpeed = function(){
      speed = this.speed;
    };
  };

  var gui = new GUI();
  gui.add(controls, 'animation', true)
    .name("Animation")
    .onChange(function(e) { controls.onEnableAnimation() });
  gui.add(controls, 'speed', 0.01, 0.5)
    .name("Light Speed")
    .onChange(function(e) { controls.onUpdateSpeed() });
  gui.add(controls, 'viewAxes', false)
    .name("View Axes")
    .onChange(function(e) { controls.onViewAxes() });
}

function render()
{
  stats.update();
  trackballControls.update();
  rotateLight();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
