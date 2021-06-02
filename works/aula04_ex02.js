import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera, 
        InfoBox,
        initDefaultBasicLight,
        onWindowResize} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position
var clock = new THREE.Clock();
initDefaultBasicLight(scene); // Adds light to the objects

// Show text information onscreen
showInformation();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25); // pedido do exercicio 25 X 25
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgb(150, 150, 150)",
    side: THREE.DoubleSide
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// Create a sphere
var sphereGeometry = new THREE.SphereGeometry(1.0, 32, 32); // pedido do exercicio raio 1.0
var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)'} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add(sphere);
// Initial config of object
var spherePositon = [1,1,1];
var sphereNewPos = [1,1,1];
var sphereSpeed = [0,0,0];
// Set initial position of the sphere
sphere.position.set(spherePositon[0], spherePositon[1], spherePositon[2]);
//sphere.translateX(1.0).translateY(1.0).translateZ(1.0);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface(); // shows controls on screen
render();

var animationOn = false; // controls animation

function move(){
  
  var speed = 0.05; // set speed of movement

  //let xy = Math.sqrt(Math.pow(sphereNewPos[0],2)+ Math.pow(sphereNewPos[1],2));
  let xyz = Math.sqrt(Math.pow(sphereNewPos[0],2)+ Math.pow(sphereNewPos[1],2)+ Math.pow(sphereNewPos[2],2));

  sphereSpeed [0] = speed * (sphereNewPos[0]/xyz);
  sphereSpeed [1] = speed * (sphereNewPos[1]/xyz);
  sphereSpeed [2] = speed * (sphereNewPos[2]/xyz);
  if(animationOn){

    // X axis
    if(sphereNewPos[0] < 0){
      if(sphereNewPos[0] < spherePositon[0]){
        spherePositon[0] = spherePositon[0] + sphereSpeed [0];
      } else if(sphereNewPos[0] > spherePositon[0]){
        spherePositon[0] = spherePositon[0] - sphereSpeed [0];
      }
    } else if(sphereNewPos[0] >= 0){
      if(sphereNewPos[0] > spherePositon[0]){
        spherePositon[0] = spherePositon[0] + sphereSpeed [0];
      } else if(sphereNewPos[0] < spherePositon[0]){
        spherePositon[0] = spherePositon[0] - sphereSpeed [0];
      }
    }
    // Y axis
    if(sphereNewPos[1] < 0){
      if(sphereNewPos[1] < spherePositon[1]){
        spherePositon[1] = spherePositon[1] + sphereSpeed [1];
      } else if(sphereNewPos[1] > spherePositon[1]){
        spherePositon[1] = spherePositon[1] - sphereSpeed [1];
      }
    } else if(sphereNewPos[1] >= 0){
      if(sphereNewPos[1] > spherePositon[1]){
        spherePositon[1] = spherePositon[1] + sphereSpeed [1];
      } else if(sphereNewPos[1] < spherePositon[1]){
        spherePositon[1] = spherePositon[1] - sphereSpeed [1];
      }
    }
    // Z axis
    if(sphereNewPos[2] < 0){
      if(sphereNewPos[2] < spherePositon[2]){
        spherePositon[2] = spherePositon[2] + sphereSpeed [2];
      } else if(sphereNewPos[2] > spherePositon[2]){
        spherePositon[2] = spherePositon[2] - sphereSpeed [2];
      }
    } else if(sphereNewPos[2] >= 0){
      if(sphereNewPos[2] > spherePositon[2]){
        spherePositon[2] = spherePositon[2] + sphereSpeed [2];
      } else if(sphereNewPos[2] < spherePositon[2]){
        spherePositon[2] = spherePositon[2] - sphereSpeed [2];
      }
    }
    //console.log(spherePositon);
    //console.log(sphereSpeed);
    sphere.position.set(spherePositon[0], spherePositon[1], spherePositon[2]);
  }
}

function buildInterface()
{
  var controls = new function ()
  {
    this.onChangeAnimation = function(){
      animationOn = !animationOn;
    };

    // set initial position of object
    this.setPosX = 1.0;
    this.setPosY = 1.0;
    this.setPosZ = 1.0;
    
    // to configure final position
    this.changePos = function(){
      sphereNewPos[0] = this.setPosX;
      sphereNewPos[1] = this.setPosY;
      sphereNewPos[2] = this.setPosZ;
    };
  };
  
  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'setPosX', -12.5, 12.5)
    .onChange(function(e) { controls.changePos() })
    .name("Coordinate X");
  gui.add(controls, 'setPosY', -12.5, 12.5)
    .onChange(function(e) { controls.changePos() })
    .name("Coordinate Y");
  gui.add(controls, 'setPosZ', 1.0, 10.0)
    .onChange(function(e) { controls.changePos() })
    .name("Coordinate Z");
  gui.add(controls, 'onChangeAnimation',true)
    .name("Start");
}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("First Movement Animation");
    controls.addParagraph();
    controls.add("Select the coordinates to move the sphere");
    controls.add("Press Start to turn on the movement preview");
    controls.add("Press Start again to turn off the movement preview");
    controls.show();
}

function render()
{
  stats.update(); // Update FPS
  requestAnimationFrame(render); // Show events
  trackballControls.update();
  //keyboardUpdate();
  move();
  renderer.render(scene, camera) // Render scene
}
