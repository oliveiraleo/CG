import * as THREE from  '../build/three.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians,
        InfoBox} from "../libs/util/util.js";

var scene = new THREE.Scene(); //create scene
// Camera configs
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0.0, 0.0, 0.0);
camera.lookAt(0, 0, 0); // Set look at origin
camera.up.set(0, 1, 0);

// Config camera holder
var cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0.0, 2.0, 0.0);
cameraHolder.up.set(0, 1, 0);
cameraHolder.lookAt(0, 0, 0);
scene.add(cameraHolder);
cameraHolder.add(camera);

var renderer = initRenderer();    // View function in util/utils

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 15 );
// Reposition of helper to better visualization of it
axesHelper.translateZ(-2);
axesHelper.translateY(20);
axesHelper.translateX(2);
scene.add( axesHelper );

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
    //camera rotation
    if (keyboard.pressed("<")) cameraHolder.rotateOnAxis(camZ, angle);
    if (keyboard.pressed(">")) cameraHolder.rotateOnAxis(camZ, -angle);
    if (keyboard.pressed(",")) cameraHolder.rotateOnAxis(camZ, angle);
    if (keyboard.pressed(".")) cameraHolder.rotateOnAxis(camZ, -angle);
    
    if (keyboard.pressed("space")) cameraHolder.translateZ(-0.2); // movement
    if (keyboard.pressed("R")) cameraHolder.translateZ(0.2); // reverse
    if (keyboard.down("A")){ // shows or hides the axes helper
        if(axesHelper.visible == false){
            axesHelper.visible = true;
        } else { 
            axesHelper.visible = false;
        }
    };
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
    requestAnimationFrame( render );
	renderer.render( scene, camera );
    keyboardUpdateHolder(); // listens to keyboard inputs and controls cameraHolder
}
render();