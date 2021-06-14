import * as THREE from  '../build/three.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians,
        initDefaultBasicLight,
        InfoBox} from "../libs/util/util.js";
//import * as airplane from 'trabalho1-airplane.js'; // Import the airplane to this file here // TODO create cronstructor and so on to import correctly

var scene = new THREE.Scene(); //create scene
initDefaultBasicLight(scene, 1, new THREE.Vector3(0, 0, 25)); // Adds some light to the scene

// airplane config
var planePositionX = 0.0;
var planePositionY = 20.0;
var planePositionZ = 5.0;

var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var mockPlaneGeometry = new THREE.BoxGeometry(9.5, 1.5, 1.5, 32);
var mockPlane = new THREE.Mesh(mockPlaneGeometry, fuselageMaterial);
mockPlane.position.set(planePositionX, planePositionY, planePositionZ); // initial position
scene.add(mockPlane);

// Base mock sphere
var mockBaseSphereGeometry = new THREE.SphereGeometry(1.01, 2, 2);
var mockBaseSphere = new THREE.Mesh( mockBaseSphereGeometry, fuselageMaterial );
// Set initial position of the sphere
mockBaseSphere.translateX(0.0).translateY(-25.0).translateZ(0.0); // distance between airplane and camera

// Camera configs
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0.0, 10.0, 20.0); // Initial camera position
//camera.lookAt(0, 0, 0); // Set look at origin
//camera.up.set(0, 1, 0);

// Config camera holder
var cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0.0, 2.0, 0.0);
cameraHolder.up.set(0, 1, 0);
cameraHolder.lookAt(0, 0, 0);
//scene.add(cameraHolder);
mockBaseSphere.add(cameraHolder);
mockPlane.add(mockBaseSphere);
cameraHolder.add(camera);

var renderer = initRenderer();    // View function in util/utils

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 15 );
// Reposition of helper to better visualization of it
//axesHelper.translateZ(-2);
axesHelper.translateY(20); // TODO remove translation from axes helper
axesHelper.translateX(2);
//scene.add( axesHelper );

var groundPlaneWired = createGroundPlaneWired(500, 500, 20, 20, "blue");
//groundPlaneWired.translateY(0);
groundPlaneWired.rotateX(degreesToRadians(90));
scene.add(groundPlaneWired);
groundPlaneWired.add(axesHelper);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Adds light
scene.add(new THREE.HemisphereLight());

// Show text information onscreen
showInformation(); // displays controls

function airplaneSpeed(){
    var speed = 0.2;

    var controls = new function ()
    {
      this.onChangeAnimation = function(){
        animationOn = !animationOn;
      };
      this.speed = baseAnimationSpeed;
  
      this.changeSpeed = function(){
        speed = (this.speed);
      };
    }

    cameraHolder.translateZ(-speed);
}

var speed = 0.2;
var savedSpeed = speed;
var pressed = [false,false]; //x,y
var anglesVet = [0,0,0];

// Keyboard controls for cameraHolder
function keyboardUpdateHolder() {

    keyboard.update();
    var angle = degreesToRadians(1);
    var camX = new THREE.Vector3(1, 0, 0); // Set X axis
    var camY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var camZ = new THREE.Vector3(0, 0, 1); // Set Z axis
    var x;
    
    if (keyboard.pressed("left")){
        mockPlane.rotateOnAxis(camZ, angle);
    }
    if (keyboard.pressed("right")){
        mockPlane.rotateOnAxis(camZ, -angle);
    }
    if (keyboard.pressed("up")){
        pressed[0] = true;
        //mockBaseSphere.rotateOnAxis(camX, angle);
        mockPlane.rotateOnAxis(camX, -angle);
        anglesVet[0] = anglesVet[0] - angle;
    }
    if (keyboard.pressed("down")){
        pressed[0] = true;
        mockPlane.rotateOnAxis(camX, angle);
        anglesVet[0] = anglesVet[0] + angle;
    } 
    //camera rotation // TODO adjust all other controls
    //if (keyboard.pressed("<")) x = mockPlane.rotateOnAxis(camY, -angle);
    //if (keyboard.pressed(">")) mockPlane.rotateOnAxis(camY, angle);
    if (keyboard.pressed(",")){ // keep camera steady
        mockBaseSphere.rotateOnAxis(camY, -angle);
        mockPlane.rotateOnAxis(camY, angle);
        pressed[1] = true;
        anglesVet[1] = anglesVet[1] - angle;
    }
    if (keyboard.pressed(".")){
        mockBaseSphere.rotateOnAxis(camY, angle);
        mockPlane.rotateOnAxis(camY, -angle);
        pressed[1] = true;
        anglesVet[1] = anglesVet[1] + angle;
    }
    
    //if (keyboard.pressed("space")) cameraHolder.translateZ(-speed); // movement
    //if (keyboard.pressed("R")) cameraHolder.translateZ(0.2); // reverse
    if (keyboard.pressed("Q")){ // speed up
        if (speed >= 1.0){ // set maximum speed
            speed = 1.0;
        } else {
            speed += 0.01;
        }
        //console.log(speed);
    } 
    if (keyboard.pressed("A")){ // slow down
        if (speed <= 0.0){ // set minimum speed
            speed = 0.0;
        } else {
            speed -= 0.01;
        }
        //console.log(speed);
    }
    if (keyboard.down("space")){ // inspection mode switch
        if (speed > 0.0){
        //    savedSpeed = speed;
        }
        if(groundPlaneWired.visible == false){
            groundPlaneWired.visible = true;
            speed = savedSpeed;
        } else { 
            groundPlaneWired.visible = false;
            savedSpeed = speed;
            speed = 0.0;
        }
        /*if(groundPlaneWired.visible == false){
            groundPlaneWired.visible = true;
        } else { 
            groundPlaneWired.visible = false;
        }*/
        //console.log(speed); TODO solve bug at zero speed, change minimum speed to above 0.0???
    }

    // Controles não precionados
    if (keyboard.up(",")){ // keep camera steady
        //mockBaseSphere.rotateOnAxis(camY, angle);
        //mockPlane.rotateOnAxis(camY, -angle);
        pressed[1] = false;
    }
    if (keyboard.up(".")){
        //mockBaseSphere.rotateOnAxis(camY, -angle);
        //mockPlane.rotateOnAxis(camY, angle);
        pressed[1] = false;
    }
    if (keyboard.up("up")){ // keep camera steady
        //mockBaseSphere.rotateOnAxis(camY, angle);
        //mockPlane.rotateOnAxis(camY, -angle);
        pressed[0] = false;
    }
    if (keyboard.up("down")){
        //mockBaseSphere.rotateOnAxis(camY, -angle);
        //mockPlane.rotateOnAxis(camY, angle);
        pressed[0] = false;
    }

    if(!pressed[1]){
        if(anglesVet[1]<0){
            mockBaseSphere.rotateOnAxis(camY, angle);
            mockPlane.rotateOnAxis(camY, -angle);
            //pressed[1] = f;
            anglesVet[1] = anglesVet[1] + angle;
            if(anglesVet[1]>=0){
                anglesVet[1]=0;
            }
        } else if(anglesVet[1]>0){
            mockBaseSphere.rotateOnAxis(camY, -angle);
            mockPlane.rotateOnAxis(camY, +angle);
            //pressed[1] = f;
            anglesVet[1] = anglesVet[1] - angle;
            if(anglesVet[1]<=0){
                anglesVet[1]=0;
            }
        }
    }

    if(!pressed[0]){
        if(anglesVet[0]<0){
            //mockBaseSphere.rotateOnAxis(camX, angle);
            mockPlane.rotateOnAxis(camX, +angle);
            //pressed[1] = f;
            anglesVet[0] = anglesVet[0] + angle;
            if(anglesVet[0]>=0){
                anglesVet[0]=0;
            }
        } else if(anglesVet[0]>0){
            //mockBaseSphere.rotateOnAxis(camX, -angle);
            mockPlane.rotateOnAxis(camX, -angle);
            //pressed[1] = f;
            anglesVet[0] = anglesVet[0] - angle;
            if(anglesVet[0]<=0){
                anglesVet[0]=0;
            }
        }
    }

}

function showInformation()
{
  // Use this to show information onscreen
    var controls = new InfoBox();
    controls.add("Flight Simulator controls:");
    controls.addParagraph();
    controls.add("Press arrow keys to change movement direction");
    controls.add("Press , (comma) or . (point) to change camera angle");
    controls.add("Press SPACE to toggle inspection mode");
    controls.add("Press Q to move faster");
    controls.add("Press A to move slower");
    //controls.add("Press R to reverse move");
    //controls.add("Press A to toggle Axes Helper visibility");
    controls.show();
}

function render() {
    requestAnimationFrame( render );
	renderer.render( scene, camera );
    keyboardUpdateHolder(); // listens to keyboard inputs and controls cameraHolder
    //cameraHolder.translateZ(-speed) // moves the camera automatically
    mockPlane.translateY(speed); // moves the plane automatically
}
render();
