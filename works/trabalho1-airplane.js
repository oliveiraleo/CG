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
// TODO move axes helper to the side

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
rightWing.position.set(4.0, 0.0, 2.5);
// create the left wing
var leftWing = new THREE.Mesh(wingsGeometry, material);
leftWing.position.set(-4.0, 0.0, 2.5);

// create the base cylinder
var baseCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 7, 32);
var baseCylinder = new THREE.Mesh(baseCylinderGeometry, material);
baseCylinder.position.set(0.0, 0.0, 2.5);
// rotate to 90° angle
//cylinder.rotateX(degreesToRadians(90));

// create the rear cylinder
var backCylinderGeometry = new THREE.CylinderGeometry(1.5, 0.5, 5, 32);
var backCylinder = new THREE.Mesh(backCylinderGeometry, material);
backCylinder.position.set(0.0, -6.0, 2.5);

// create tail cylinder
var tailCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
var tailCylinder = new THREE.Mesh(tailCylinderGeometry, material);
tailCylinder.position.set(0.0, -9.0, 2.5);

// define airplane stabilizers geometry
var verticalStabilizerGeometry = new THREE.BoxGeometry(3, 1, 0.2);
var horizontalStabilizerGeometry = new THREE.BoxGeometry(0.2, 0.5, 2);
// create the right stabilizer
var rightStabilizer = new THREE.Mesh(verticalStabilizerGeometry, material);
rightStabilizer.position.set(1.0, -9.0, 2.5);
// create the left stabilizer
var leftStabilizer = new THREE.Mesh(verticalStabilizerGeometry, material);
leftStabilizer.position.set(-1.0, -9.0, 2.5);
// create horizontal stabilizer
var horizontalStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, material);
horizontalStabilizer.position.set(0.0, -9.0, 3.5);

// create the front cylinder
var frontCylinderGeometry = new THREE.CylinderGeometry(0.5, 1.5, 2, 32);
var frontCylinder = new THREE.Mesh(frontCylinderGeometry, material);
frontCylinder.position.set(0.0, 4.5, 2.5);

// define blades material
var bladesMaterial = new THREE.MeshBasicMaterial({
  color: "white", // TODO change to a better color
  side: THREE.DoubleSide,
});

// create blades prototype
var bladesGeometry = new THREE.CircleGeometry(2, 32);
var blades = new THREE.Mesh(bladesGeometry, bladesMaterial);
blades.position.set(0.0, 5.52, 2.5);
// rotate to 90° angle
blades.rotateX(degreesToRadians(90));

// landing gear
// creates tires geometry
var tiresGeometry = new THREE.TorusGeometry(0.2, 0.1, 8, 24);
// front
var frontTire = new THREE.Mesh(tiresGeometry, material);
frontTire.position.set(5.0, 5.0, 0.3);
// back left
var backLeftTire = new THREE.Mesh(tiresGeometry, material);
backLeftTire.position.set(4.0, 4.0, 0.3);
// back right
var backRightTire = new THREE.Mesh(tiresGeometry, material);
backRightTire.position.set(6.0, 4.0, 0.3);
// rotate tires to adjust angles
frontTire.rotateX(degreesToRadians(90));
frontTire.rotateY(degreesToRadians(90));
backLeftTire.rotateX(degreesToRadians(90));
backLeftTire.rotateY(degreesToRadians(90));
backRightTire.rotateX(degreesToRadians(90));
backRightTire.rotateY(degreesToRadians(90));

// create the pilot's cockpit
var cockpitGeometry = new THREE.SphereGeometry(1, 32, 32);
var cockpit = new THREE.Mesh(cockpitGeometry, material);
cockpit.position.set(0.0, -1.5, 3.6);

// position the cube
//cube.position.set(0.0, 0.0, 2.0);
//cube2.position.set(2.0, 5.0, 1.5);
//cube3.position.set(6.0, -5.0, 3.0);

// add the objects to the scene
scene.add(rightWing);
scene.add(leftWing);
scene.add(baseCylinder);
scene.add(backCylinder);
scene.add(tailCylinder);
scene.add(leftStabilizer);
scene.add(rightStabilizer);
scene.add(horizontalStabilizer);
scene.add(frontCylinder);
scene.add(blades);
scene.add(cockpit);
/*scene.add(frontTire); // TODO enable and position landing gear tires
scene.add(backRightTire);
scene.add(backLeftTire);*/

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