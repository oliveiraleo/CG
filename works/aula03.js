import * as THREE from  '../build/three.module.js';
//import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
//import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
//import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
//        initDefaultLighting,
//        createGroundPlane,
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians,
        InfoBox} from "../libs/util/util.js";

var scene = new THREE.Scene(); //create scene
//Camera configs
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0.0, 0.0, 0.0);
camera.lookAt(0, 0, 0); // Set look at origin
camera.up.set(0, 1, 0);
//var clock = new THREE.Clock();
//Config camera holder
var cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0.0, 2.0, 0.0);
cameraHolder.up.set(0, 1, 0);
cameraHolder.lookAt(0, 0, 0);
scene.add(cameraHolder);
cameraHolder.add(camera);
//scene.add(camera);

//const renderer = new THREE.WebGLRenderer();
var renderer = initRenderer();    // View function in util/utils
//renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

// Enable mouse rotation, pan, zoom etc.
//var trackballControls = new TrackballControls( camera, renderer.domElement );

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 15 );
// Reposition of helper to better visualization of it
axesHelper.translateZ(-2);
axesHelper.translateY(20);
axesHelper.translateX(2);
scene.add( axesHelper );

// create the ground plane
/*var planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);*/
// add the plane to the scene
/*scene.add(plane);
var vecTest = new THREE.Vector3(0, 1, 0);
plane.set(vecTest);*/

var groundPlaneWired = createGroundPlaneWired(100, 100, 100, 100, "grey");
groundPlaneWired.translateY(2);
groundPlaneWired.rotateX(degreesToRadians(90));
scene.add(groundPlaneWired);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Adds light
scene.add(new THREE.HemisphereLight());

// Show text information onscreen
showInformation(); // displays controls

// Testing new controls (wrong way acconding to the exercise)
function keyboardUpdateTest() {

    keyboard.update();
    var angle = degreesToRadians(1);
    var camX = new THREE.Vector3(1, 0, 0); // Set X axis
    var camY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var camZ = new THREE.Vector3(0, 0, 1); // Set Z axis

    if (keyboard.pressed("left")) cameraHolder.rotateOnAxis(camZ, angle);
    if (keyboard.pressed("right")) cameraHolder.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed("up")) cameraHolder.rotateOnAxis(camX, -angle);
    if (keyboard.pressed("down")) cameraHolder.rotateOnAxis(camX, angle);
    //if (keyboard.pressed("<")) cameraHolder.rotateOnAxis(camZ, angle);
    //if (keyboard.pressed(">")) cameraHolder.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed(",")) cameraHolder.rotateOnAxis(camY, angle);
    if (keyboard.pressed(".")) cameraHolder.rotateOnAxis(camY, -angle);
    if (keyboard.pressed("space")) cameraHolder.translateY(-0.2)
    //if (keyboard.pressed("R")) cameraHolder.translateY(0.2)
}
// Keyboard controls for cameraHolder
function keyboardUpdateHolder() {

    keyboard.update();
    var angle = degreesToRadians(1);
    var camX = new THREE.Vector3(1, 0, 0); // Set X axis
    var camY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var camZ = new THREE.Vector3(0, 0, 1); // Set Z axis
    
    if (keyboard.pressed("left")) cameraHolder.rotateOnAxis(camY, angle);
    if (keyboard.pressed("right")) cameraHolder.rotateOnAxis(camY, -angle);
    if (keyboard.pressed("up")) cameraHolder.rotateOnAxis(camX, -angle);
    if (keyboard.pressed("down")) cameraHolder.rotateOnAxis(camX, angle);
    if (keyboard.pressed("<")) cameraHolder.rotateOnAxis(camZ, angle);
    if (keyboard.pressed(">")) cameraHolder.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed(",")) cameraHolder.rotateOnAxis(camZ, angle);
    if (keyboard.pressed(".")) cameraHolder.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed("space")) cameraHolder.translateZ(-0.2);
    if (keyboard.pressed("R")) cameraHolder.translateZ(0.2);
    if (keyboard.down("A")){ //shows or hides the axes helper
        if(axesHelper.visible == false){
            axesHelper.visible = true;
        } else { 
            axesHelper.visible = false;
        }
    };
}

// Keyboard controls for camera
function keyboardUpdate() {

    keyboard.update();
    var angle = degreesToRadians(1);
    var camX = new THREE.Vector3(1, 0, 0); // Set X axis
    var camY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var camZ = new THREE.Vector3(0, 0, 1); // Set Z axis

    if (keyboard.pressed("left")) camera.rotateOnAxis(camY, angle);
    if (keyboard.pressed("right")) camera.rotateOnAxis(camY, -angle);
    if (keyboard.pressed("up")) camera.rotateOnAxis(camX, -angle);
    if (keyboard.pressed("down")) camera.rotateOnAxis(camX, angle);
    if (keyboard.pressed("<")) camera.rotateOnAxis(camZ, angle);
    if (keyboard.pressed(">")) camera.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed(",")) camera.rotateOnAxis(camZ, angle);
    if (keyboard.pressed(".")) camera.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed("space")) camera.translateZ(-0.2)
    //if (keyboard.pressed("R")) camera.translateZ(0.2)
}

function showInformation()
{
  // Use this to show information onscreen
    var controls = new InfoBox();
    controls.add("Flying camera controls:");
    controls.addParagraph();
    controls.add("Press arrow keys to move the camera");
    controls.add("Press , (comma) or . (point) to change camera angle");
    controls.add("Press SPACE to move");
    controls.add("Press R to reverse move");
    controls.add("Press A to toggle Axes Helper visibility");
    controls.show();
}

function render() {
	//trackballControls.update();
    requestAnimationFrame( render );
	renderer.render( scene, camera );
    //keyboardUpdate(); //listens to keyboard inputs and controls camera
    keyboardUpdateHolder(); //listens to keyboard inputs and controls cameraHolder
    //keyboardUpdateTest(); //listens to keyboard inputs and controls camera (fix)
    //console.log(camera.position);
}
render();