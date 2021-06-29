import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        degreesToRadians, 
        onWindowResize,
        initDefaultSpotlight,
        initDefaultBasicLight} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position //TODO adjust camera position
var trackballControls = new TrackballControls( camera, renderer.domElement );
//initDefaultBasicLight(scene);
initDefaultSpotlight(scene, new THREE.Vector3(5.0, -10.0, 15.0)); // Adds a spotlight to the scene

// Set angles of rotation
var angle = 0;
var angle2 = 0;
var speed = 0.05;
var animationOn = true; // control if animation is on or of

// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({ // TODO change that to enable shadow ?
    //color: "rgba(150, 150, 150)", // light grey
    color: "green", // grass
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the ground plane to the scene
scene.add(plane);

// Base sphere
/*var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)'} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
scene.add(sphere);
// Set initial position of the sphere
sphere.translateX(1.0).translateY(1.0).translateZ(1.0);*/

// More information about cylinderGeometry here ---> https://threejs.org/docs/#api/en/geometries/CylinderGeometry
/*var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
var cylinderMaterial = new THREE.MeshPhongMaterial( {color:'rgb(100,255,100)'} );
var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
sphere.add(cylinder);*/

// Parts names reference from here:
// https://energyeducation.ca/encyclopedia/Wind_turbine

// Concrete base box
var baseBoxGeometry = new THREE.BoxGeometry(2.0, 2.0, 2.0);
var baseBoxMaterial = new THREE.MeshPhongMaterial( {color:'rgb(150, 150, 150)'} ); // grey // TODO change color
var baseBox = new THREE.Mesh(baseBoxGeometry, baseBoxMaterial);
baseBox.position.set(0.0, 0.0, 1.0); // put it above the ground plane

// Tower
var towerCylinderGeometry = new THREE.CylinderGeometry(0.07, 0.17, 5.0, 25);
var towerCylinderMaterial = new THREE.MeshPhongMaterial( {color:'yellow'} );
var towerCylinder = new THREE.Mesh( towerCylinderGeometry, towerCylinderMaterial );
towerCylinder.rotateX(degreesToRadians(90)); // rotate // TODO add comment here
//towerCylinder.translateX(0.0).translateY(2.5).translateZ(0.0);
towerCylinder.position.set(0.0, 0.0, 3.5); // put it above the base box
//towerCylinderMaterial.castShadow = true; // TODO fix shadow

// Nacelle ("body"/main box)
var nacelleGeometry = new THREE.BoxGeometry(1.0, 1.0, 2.0);
var nacelleMaterial = new THREE.MeshPhongMaterial( {color:'blue'} );
var nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial); // TODO change material
nacelle.position.set(0.0, 3.0, 0.0);

// Rotor
// Create a ring for position the blades
var ringGeometry = new THREE.TorusGeometry(0.0, 0.1, 8, 24);
var ring = new THREE.Mesh(ringGeometry, towerCylinderMaterial);
ring.rotateX(degreesToRadians(90)); // rotate to the front side
// create rotor and blades
var rotorGeometry = new THREE.ConeGeometry(0.4, 0.8, 32);
var rotorMaterial = new THREE.MeshPhongMaterial( {color:'red'} );
var rotor = new THREE.Mesh(rotorGeometry, rotorMaterial); // TODO change material
rotor.rotateX(degreesToRadians(90)); // rotate to the front side
rotor.position.set(0.0, 0.0, 1.4);
// define blades geometry
var bladeGeometry = new THREE.BoxGeometry(0.2, 0.05, 3.0);
var bladeMaterial = new THREE.MeshPhongMaterial( {color:'white'} );
// lower blade
var blade1 = new THREE.Mesh(bladeGeometry, bladeMaterial); // create blades // TODO change material
blade1.rotateX(degreesToRadians(90)); // rotate to the front side
blade1.position.set(0.0, 1.6, 0.0);
// right blade
var blade2 = new THREE.Mesh(bladeGeometry, bladeMaterial); // create blades // TODO change material
blade2.rotateX(degreesToRadians(90)); // rotate to the front side
blade2.rotateY(degreesToRadians(60)); // rotate to correct angular position
blade2.position.set(1.2, -0.75, 0.0);
// left blade
var blade3 = new THREE.Mesh(bladeGeometry, bladeMaterial); // create blades // TODO change material
blade3.rotateX(degreesToRadians(90)); // rotate to the front side
blade3.rotateY(degreesToRadians(120)); // rotate to correct angular position
blade3.position.set(-1.2, -0.75, 0.0);

// Add all objects to the scene
plane.add(baseBox);
baseBox.add(towerCylinder);
towerCylinder.add(nacelle);
nacelle.add(rotor);
rotor.add(ring);
ring.add(blade1);
ring.add(blade2);
ring.add(blade3);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//buildInterface();
render();

function rotateCylinder()
{
  // More info:
  // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
  //cylinder.matrixAutoUpdate = false;
  //cylinder2.matrixAutoUpdate = false;

  // Set angle's animation speed
  if(animationOn)
  {
    angle+=speed;
    angle2+=speed*2;
    
    var mat4 = new THREE.Matrix4();
    //cylinder.matrix.identity();  // reset matrix
    //cylinder2.matrix.identity();  // reset

    // Will execute T1 and then R1
    /*cylinder.matrix.multiply(mat4.makeRotationZ(angle)); // R1
    cylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1*/

    // Will execute R2, T1 and R1 in this order
    /*cylinder2.matrix.multiply(mat4.makeRotationY(angle2)); // R1
    cylinder2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1
    cylinder2.matrix.multiply(mat4.makeRotationX(degreesToRadians(90))); // R2*/
  }
}

/*function buildInterface()
{
  var controls = new function ()
  {
    this.onChangeAnimation = function(){
      animationOn = !animationOn;
    };
    this.speed = 0.05;

    this.changeSpeed = function(){
      speed = this.speed;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
  gui.add(controls, 'speed', 0.05, 0.5)
    .onChange(function(e) { controls.changeSpeed() })
    .name("Change Speed");
}*/

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  rotateCylinder();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
