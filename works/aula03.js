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
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0.0, 2.0, 0.0);
camera.up.set(0, 1, 0);
camera.lookAt(0, 0, 0); // Set look at origin
var clock = new THREE.Clock();

//const renderer = new THREE.WebGLRenderer();
var renderer = initRenderer();    // View function in util/utils
//renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

// Enable mouse rotation, pan, zoom etc.
//var trackballControls = new TrackballControls( camera, renderer.domElement );

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
/*var planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);*/

var groundPlaneWired = createGroundPlaneWired(50, 50, 100, 50, "grey");
scene.add(groundPlaneWired);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//Config camera holder
var cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0.0, 2.0, 0.0);
cameraHolder.lookAt(0, 0, 0);
cameraHolder.up.set(0, 1, 0);
scene.add(cameraHolder);
cameraHolder.add(camera);

// Adds light
scene.add(new THREE.HemisphereLight());

function keyboardUpdate() {

    keyboard.update();
    var angle = degreesToRadians(1);
    var camX = new THREE.Vector3(1, 0, 0); // Set X axis
    var camY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var camZ = new THREE.Vector3(0, 0, 1); // Set Z axis

    if (keyboard.pressed("left")) cameraHolder.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed("right")) cameraHolder.rotateOnAxis(camZ, angle);
    if (keyboard.pressed("up")) cameraHolder.rotateOnAxis(camX, -angle);
    if (keyboard.pressed("down")) cameraHolder.rotateOnAxis(camX, angle);
    //if (keyboard.pressed("<")) cameraHolder.rotateOnAxis(camZ, angle);
    //if (keyboard.pressed(">")) cameraHolder.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed(",")) cameraHolder.rotateOnAxis(camY, angle);
    if (keyboard.pressed(".")) cameraHolder.rotateOnAxis(camY, -angle);
    if (keyboard.pressed("space")) cameraHolder.translateY(-0.2) //translateZ(0.2);
}

function render() {
	//trackballControls.update();
    requestAnimationFrame( render );
	renderer.render( scene, camera );
    keyboardUpdate();
    //console.log(camera.position);
}
render();