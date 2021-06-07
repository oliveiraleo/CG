import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        degreesToRadians,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    //color: "green",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// define objects material
var material = new THREE.MeshNormalMaterial();

var wingsGeometry = new THREE.BoxGeometry(6, 3, 0.2);
// create the right wing
var rightWing = new THREE.Mesh(wingsGeometry, material);
rightWing.position.set(4.0, 0.0, 1.5);
// create the left wing
var leftWing = new THREE.Mesh(wingsGeometry, material);
leftWing.position.set(-4.0, 0.0, 1.5);

// create the base cylinder
var baseCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 7, 32);
var baseCylinder = new THREE.Mesh(baseCylinderGeometry, material);
baseCylinder.position.set(0.0, 0.0, 1.5);
// rotate to 90° angle
//cylinder.rotateX(degreesToRadians(90));

// create the rear cylinder
var backCylinderGeometry = new THREE.CylinderGeometry(1.5, 0.5, 5, 32);
var backCylinder = new THREE.Mesh(backCylinderGeometry, material);
backCylinder.position.set(0.0, -6.0, 1.5);

// create the front cylinder
var frontCylinderGeometry = new THREE.CylinderGeometry(0.5, 1.5, 2, 32);
var frontCylinder = new THREE.Mesh(frontCylinderGeometry, material);
frontCylinder.position.set(0.0, 4.5, 1.5);

// define blades material
var bladesMaterial = new THREE.MeshBasicMaterial({
  color: "white", // TODO change to a better color
  side: THREE.DoubleSide,
});

// create blades prototype
var bladesGeometry = new THREE.CircleGeometry(2, 32);
var blades = new THREE.Mesh(bladesGeometry, bladesMaterial);
blades.position.set(0.0, 5.52, 1.5);
// rotate to 90° angle
blades.rotateX(degreesToRadians(90));

// create the pilot's cockpit
var cockpitGeometry = new THREE.SphereGeometry(1, 32, 32);
var cockpit = new THREE.Mesh(cockpitGeometry, material);
cockpit.position.set(0.0, -1.5, 2.6);

// position the cube
//cube.position.set(0.0, 0.0, 2.0);
//cube2.position.set(2.0, 5.0, 1.5);
//cube3.position.set(6.0, -5.0, 3.0);

// add the objects to the scene
scene.add(rightWing);
scene.add(leftWing);
scene.add(baseCylinder);
scene.add(backCylinder);
scene.add(frontCylinder);
scene.add(blades);
scene.add(cockpit);

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}