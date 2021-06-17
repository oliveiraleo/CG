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
var renderer = initRenderer();    // View function in util/utils
initDefaultBasicLight(scene, 1, new THREE.Vector3(0, 0, 25)); // Adds some light to the scene
// TODO ordem dos movimentos resolve o angulo

//-----------------------------------//
// AIRPLANE CONFIGURATION BEGIN      //
//-----------------------------------//

// airplane config
var planePositionX = 0.0;
var planePositionY = 20.0;
var planePositionZ = 5.0;

var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var mockPlaneGeometry = new THREE.BoxGeometry(0, 0, 0, 32);
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
var cameraPosition = [0,10,20];
camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]); // Initial camera position
//camera.lookAt(0, 0, 0); // Set look at origin
//camera.up.set(0, 1, 0);

// Config camera holder
var cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0.0, 2.0, 0.0);
cameraHolder.up.set(0, 1, 0);
cameraHolder.lookAt(0, 0, 0);
//scene.add(cameraHolder);
//mockPlane.add(cameraHolder);
mockBaseSphere.add(cameraHolder);
mockPlane.add(mockBaseSphere);
cameraHolder.add(camera);
//scene.add(mockBaseSphere);

// define objects material
var material = new THREE.MeshNormalMaterial();
var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var cockpitMaterial = new THREE.MeshPhongMaterial({color:"white"});
var tailMaterial = new THREE.MeshPhongMaterial({color:"orange", emissive:"rgb(255, 100, 0)", emissiveIntensity:"0.75"}); // bright orange
var tiresMaterial = new THREE.MeshPhongMaterial({color:"black"}); 
var hubMaterial = new THREE.MeshPhongMaterial({color:"red"});
var stabilizersMaterial = new THREE.MeshPhongMaterial({color:"green"});
var flapsMaterial = new THREE.MeshPhongMaterial({color:"yellow"});
var lifesaverMaterial = new THREE.MeshPhongMaterial({color:"red", emissiveIntensity:"0.95"}); // bright red


// Reference URL to all ariplane parts names
// https://www.flyaeroguard.com/learning-center/parts-of-an-airplane/


//-----------------------------------//
// FUSELAGE                          //
//-----------------------------------//
// define airplane wings geometry
var wingsGeometry = new THREE.BoxGeometry(10.0, 3.0, 0.2);
// create the right wing
var rightWing = new THREE.Mesh(wingsGeometry, fuselageMaterial);
rightWing.position.set(6.5, -1.0, 0.0);
// create the left wing
var leftWing = new THREE.Mesh(wingsGeometry, fuselageMaterial);
leftWing.position.set(-6.5, -1.0, 0.0);
// wing engines
var enginesCylinderGeometry = new THREE.CylinderGeometry(1.0, 1.0, 4.0, 32);
// left engine
var leftEngineCylinder = new THREE.Mesh(enginesCylinderGeometry, fuselageMaterial);
leftEngineCylinder.position.set(0.0, 0.0, -0.5);
// right engine
var rightEngineCylinder = new THREE.Mesh(enginesCylinderGeometry, fuselageMaterial);
rightEngineCylinder.position.set(0.0, 0.0, -0.5);

// define airplane flaps geometry
var flapsGeometry = new THREE.BoxGeometry(10.0, 0.4, 0.2);
var leftFlap = new THREE.Mesh(flapsGeometry, flapsMaterial);
var rightFlap = new THREE.Mesh(flapsGeometry, flapsMaterial);
leftFlap.position.set(0.0, -1.72, 0.0);
rightFlap.position.set(0.0, -1.72, 0.0);

// create the base cylinder
var baseCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 9.0, 32);
var baseCylinder = new THREE.Mesh(baseCylinderGeometry, fuselageMaterial);
baseCylinderGeometry = new THREE.CylinderGeometry(0, 0, 0, 32);
var baseCylinderTeste = new THREE.Mesh(baseCylinderGeometry, fuselageMaterial);
baseCylinder.position.set(0.0, 0.0, 2.5); // ajuste de altura do avião em relação a câmera

// create the rear cylinder
var backCylinderGeometry = new THREE.CylinderGeometry(1.5, 0.5, 5, 32);
var backCylinder = new THREE.Mesh(backCylinderGeometry, fuselageMaterial);
backCylinder.position.set(0.0, -7.0, 0.0);

// create tail cylinder
var tailCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
var tailCylinder = new THREE.Mesh(tailCylinderGeometry, fuselageMaterial);
tailCylinder.position.set(0.0, -3.0, 0.0);

// define airplane stabilizers geometry
var horizontalStabilizerGeometry = new THREE.BoxGeometry(3, 1, 0.2);
var verticalStabilizerGeometry = new THREE.BoxGeometry(0.2, 0.5, 2);
// create the right stabilizer
var rightStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, stabilizersMaterial);
rightStabilizer.position.set(2.0, 0.0, 0.0);
// create the left stabilizer
var leftStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, stabilizersMaterial);
leftStabilizer.position.set(-2.0, 0.0, 0.0);
// create vertical stabilizer
var verticalStabilizer = new THREE.Mesh(verticalStabilizerGeometry, tailMaterial);
verticalStabilizer.position.set(0.0, -0.25, 1.5);
// define airplane back flaps geometry
var backFlapsGeometry = new THREE.BoxGeometry(3.0, 0.4, 0.2);
var backRudderGeometry = new THREE.BoxGeometry(0.2, 0.4, 2.0);
var backLeftFlap = new THREE.Mesh(backFlapsGeometry, flapsMaterial);
var backRightFlap = new THREE.Mesh(backFlapsGeometry, flapsMaterial);
var backRudder = new THREE.Mesh(backRudderGeometry, flapsMaterial);
backLeftFlap.position.set(0.0, -0.72, 0.0);
backRightFlap.position.set(0.0, -0.72, 0.0);
backRudder.position.set(0.0, -0.47, 0.0);


// EASTER EGGs BEGIN //
// life saver easter egg
var rightLifesaverGeometry = new THREE.TorusGeometry(0.4, 0.2, 8, 24);
var rightLifesaver = new THREE.Mesh(rightLifesaverGeometry, lifesaverMaterial);
rightLifesaver.position.set(1.6, -3.5, 0.0);
rightLifesaver.rotateX(degreesToRadians(90));
rightLifesaver.rotateY(degreesToRadians(90));

// fake radar
var radarGeometry = new THREE.OctahedronGeometry(0.8, 3);
var radar = new THREE.Mesh(radarGeometry, fuselageMaterial);
radar.position.set(0.0, 0.0, -1.5);

// define airplane 3D crosses geometry
var crossGeometry = new THREE.BoxGeometry(1.0, 0.4, 0.4);
// left
var leftCrossp1 = new THREE.Mesh(crossGeometry, lifesaverMaterial); // cross part 1
var leftCrossp2 = new THREE.Mesh(crossGeometry, lifesaverMaterial); // cross part 2
leftCrossp1.rotateZ(degreesToRadians(90));
// right
var rightCrossp1 = new THREE.Mesh(crossGeometry, lifesaverMaterial); // cross part 1
var rightCrossp2 = new THREE.Mesh(crossGeometry, lifesaverMaterial); // cross part 2
rightCrossp1.rotateZ(degreesToRadians(90));
// EASTER EGGs END //


// create the front cylinder
var frontCylinderGeometry = new THREE.CylinderGeometry(0.5, 1.5, 0.5, 32);
var frontCylinder = new THREE.Mesh(frontCylinderGeometry, fuselageMaterial);
frontCylinder.position.set(0.0, 4.75, 0.0);


//-----------------------------------//
// PROPELLER                         //
//-----------------------------------//
// create blades hub
var hubGeometry = new THREE.ConeGeometry(0.5, 1.0, 32);
var hub = new THREE.Mesh(hubGeometry, hubMaterial);
// define blades geometry
var bladeGeometry = new THREE.BoxGeometry(0.4, 0.05, 5.0);
var wingsBladeGeometry = new THREE.BoxGeometry(0.2, 0.05, 4.0);
// create blades
var blade = new THREE.Mesh(bladeGeometry, cockpitMaterial);
// adds blade to the hub
hub.add(blade);
// Base hub sphere
var hubBaseSphereGeometry = new THREE.SphereGeometry(0.01, 2, 2);
var hubBaseSphere = new THREE.Mesh( hubBaseSphereGeometry, material );
// Set initial position of the sphere
hubBaseSphere.translateX(0.0).translateY(0.75).translateZ(0.0);
// adds the hub to the base sphere
hubBaseSphere.add(hub);
// engines on wings
var leftHub = new THREE.Mesh(hubGeometry, hubMaterial);
var leftBlade = new THREE.Mesh(wingsBladeGeometry, cockpitMaterial);
var rightHub = new THREE.Mesh(hubGeometry, hubMaterial);
var rightBlade = new THREE.Mesh(wingsBladeGeometry, cockpitMaterial);
var leftHubBaseSphere = new THREE.Mesh( hubBaseSphereGeometry, material );
var rightHubBaseSphere = new THREE.Mesh( hubBaseSphereGeometry, material );
// Set initial position of the sphere
leftHubBaseSphere.translateX(0.0).translateY(2.5).translateZ(0.0);
rightHubBaseSphere.translateX(0.0).translateY(2.5).translateZ(0.0);
// adds the hub to the base sphere
leftHubBaseSphere.add(leftHub);
rightHubBaseSphere.add(rightHub);
// adds blades to the hubs
leftHub.add(leftBlade);
rightHub.add(rightBlade);


//-----------------------------------//
// LANDING GEAR                      //
//-----------------------------------//
// creates tires geometry
var tiresGeometry = new THREE.TorusGeometry(0.2, 0.1, 8, 24);
// front
var frontTire = new THREE.Mesh(tiresGeometry, tiresMaterial);
frontTire.position.set(0.0, 3.0, -2.2);
// back left
var backLeftTire = new THREE.Mesh(tiresGeometry, tiresMaterial);
backLeftTire.position.set(-1.5, -3.0, -2.2);
// back right
var backRightTire = new THREE.Mesh(tiresGeometry, tiresMaterial);
backRightTire.position.set(1.5, -3.0, -2.2);
// rotate tires to adjust angles
frontTire.rotateX(degreesToRadians(90));
frontTire.rotateY(degreesToRadians(90));
backLeftTire.rotateX(degreesToRadians(90));
backLeftTire.rotateY(degreesToRadians(90));
backRightTire.rotateX(degreesToRadians(90));
backRightTire.rotateY(degreesToRadians(90));

// create shock strut geometry
var shockStrutGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.85);
var backShockStrutsGeometry = new THREE.BoxGeometry(0.05, 0.2, 1.1);
// create front shock strut
var shockStrut = new THREE.Mesh(shockStrutGeometry, fuselageMaterial);
shockStrut.position.set(0.2, 3.0, -1.9);
// create 2nd front shock strut
var shockStrut2 = new THREE.Mesh(shockStrutGeometry, fuselageMaterial);
shockStrut2.position.set(-0.2, 3.0, -1.9);
// create front tire cylinder axis
var frontTireCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 32);
var frontTireCylinder = new THREE.Mesh(frontTireCylinderGeometry, fuselageMaterial);
frontTireCylinder.rotateZ(degreesToRadians(90));
frontTireCylinder.position.set(0.0, 3.0, -2.2);
// create back left shock strut
var backLeftShockStrut = new THREE.Mesh(backShockStrutsGeometry, fuselageMaterial);
backLeftShockStrut.position.set(-0.9, -3.0, -1.75);
// rotate to 90° angle
backLeftShockStrut.rotateY(degreesToRadians(45));
// create back right shock strut
var backRightShockStrut = new THREE.Mesh(backShockStrutsGeometry, fuselageMaterial);
backRightShockStrut.position.set(0.9, -3.0, -1.75);
// rotate to 90° angle
backRightShockStrut.rotateY(degreesToRadians(-45));
// create back tire cylinder axis
var backTiresCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3.0, 32);
var backTiresCylinder = new THREE.Mesh(backTiresCylinderGeometry, fuselageMaterial);
backTiresCylinder.rotateZ(degreesToRadians(90));
backTiresCylinder.position.set(0.0, -3.0, -2.2);

// create the pilot's cockpit
var cockpitGeometry = new THREE.SphereGeometry(1, 32, 32);
var cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
cockpit.position.set(0.0, -2.5, 1.25);


// Joins every airplane part togheter
// PROPELLER
frontCylinder.add(hubBaseSphere);
// FUSELAGE
// main structure
baseCylinder.add(frontCylinder);
baseCylinder.add(backCylinder);
baseCylinder.add(rightLifesaver);
baseCylinder.add(radar);
backCylinder.add(tailCylinder);
// wings
baseCylinder.add(leftWing);
baseCylinder.add(rightWing);
leftWing.add(leftEngineCylinder);
rightWing.add(rightEngineCylinder);
leftEngineCylinder.add(leftHubBaseSphere);
rightEngineCylinder.add(rightHubBaseSphere);
leftWing.add(leftFlap);
rightWing.add(rightFlap);
// cockpit
baseCylinder.add(cockpit);
// TAIL
tailCylinder.add(leftStabilizer);
tailCylinder.add(rightStabilizer);
tailCylinder.add(verticalStabilizer);
leftStabilizer.add(backLeftFlap);
leftStabilizer.add(leftCrossp1);
leftStabilizer.add(leftCrossp2);
rightStabilizer.add(backRightFlap);
rightStabilizer.add(rightCrossp1);
rightStabilizer.add(rightCrossp2);
verticalStabilizer.add(backRudder);
// LANDING GEAR
// front
baseCylinder.add(shockStrut);
baseCylinder.add(shockStrut2);
baseCylinder.add(frontTireCylinder);
baseCylinder.add(frontTire);
// back
baseCylinder.add(backLeftShockStrut);
baseCylinder.add(backRightShockStrut);
baseCylinder.add(backTiresCylinder);
baseCylinder.add(backLeftTire);
baseCylinder.add(backRightTire);

// add all airplane objects to the scene
baseCylinderTeste.add(baseCylinder);
mockPlane.add(baseCylinderTeste);

//-----------------------------------//
// AIRPLANE CONFIGURATION END        //
//-----------------------------------//

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
//scene.add(new THREE.HemisphereLight());

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

var pivot = new THREE.Object3D();
var angleAviao = [-1.57, 0, 0];
var mat4 = new THREE.Matrix4();
//mockPlane.matrixAutoUpdate = false;
mockPlane.matrix.identity();


// Keyboard controls for cameraHolder
function keyboardUpdateHolder() {
    //
    mockPlane.matrix.identity();
    keyboard.update();
    var angle = degreesToRadians(1);

    var camX = new THREE.Vector3(1, 0, 0); // Set X axis
    var camY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var camZ = new THREE.Vector3(0, 0, 1); // Set Z axis
    //var x;
 
    //mockBaseSphere.matrix.multiply(mat4.makeTranslation(speed, speed, speed))
    //mockBaseSphere.matrix.multiply(mat4.makeRotationZ(angle)); // R1
    //mockBaseSphere.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));
    
    if (keyboard.pressed("left")){
        mockPlane.rotateOnAxis(camZ, angle);
        baseCylinder.rotateOnAxis(camY, -angle);
        //mockBaseSphere.rotateOnAxis(camY, +angle);
        //angleAviao[2] = degreesToRadians(angleAviao[2]+1);
        //angleAviao[1] = degreesToRadians(angleAviao[1]+1);
        //mockPlane.matrix.multiply(mat4.makeRotationZ(angleAviao[2]));
        //.matrix.multiply(mat4.makeRotationY(angleAviao[1]));
        //mockBaseSphere.matrix.multiply(mat4.makeRotationX(angle));
        //mockPlane.rotateOnAxis(camY, -angle);
        pressed[1] = true;
        anglesVet[1] = anglesVet[1] + angle;
       
    }
    if (keyboard.pressed("right")){
        mockPlane.rotateOnAxis(camZ, -angle);
        baseCylinder.rotateOnAxis(camY, angle);
        pressed[1] = true;
        anglesVet[1] = anglesVet[1] - angle;
    }
    if (keyboard.pressed("up")){
        pressed[0] = true;
        //mockBaseSphere.rotateOnAxis(new THREE.Vector3(1, 0, 0), -angle);
        //mockBaseSphere.matrix.multiply(mat4.makeRotationy(angle));
        //mockBaseSphere.matrix.multiply(mat4.makeTranslation(0.0, 0.0, 0.0));
        //mockBaseSphere.translateX(0).translateY(-25.0).translateZ(0);
        //cameraHolder.rotateOnAxis(camX, -angle);
        //mockBaseSphere.position.set(planePositionX,planePositionY,planePositionZ);
        //mockBaseSphere.translateX(planePositionX).translateY(planePositionY-25.0).translateZ(planePositionZ);
        //mockBaseSphere.matrix.multiply(mat4.makeRotationX(angle));
        //angleAviao[0] = degreesToRadians(angleAviao[0]+1);
        //mockPlane.matrix.multiply(mat4.makeRotationX(angleAviao[0]));
        mockPlane.translateZ(-0.2);
        baseCylinderTeste.rotateOnAxis(camX, -angle);
        anglesVet[0] = anglesVet[0] - angle;

    }
    if (keyboard.pressed("down")){
        pressed[0] = true;
        //mockBaseSphere.rotateOnAxis(camX, -angle);
        //mockPlane.rotateOnAxis(camX, angle);
        //mockBaseSphere.matrix.multiply(mat4.makeRotationX(-angle));
        //mockBaseSphere.rotateOnAxis(camX, -angle);
        mockPlane.translateZ(+0.2);
        baseCylinderTeste.rotateOnAxis(camX, +angle);
        anglesVet[0] = anglesVet[0] + angle;
    } 
    //camera rotation // TODO adjust all other controls
    //if (keyboard.pressed("<")) x = mockPlane.rotateOnAxis(camY, -angle);
    //if (keyboard.pressed(">")) mockPlane.rotateOnAxis(camY, angle);
    if (keyboard.pressed(",")){ // keep camera steady
        /*
        mockBaseSphere.rotateOnAxis(camY, +angle);
        mockPlane.rotateOnAxis(camY, -angle);
        pressed[1] = true;
        anglesVet[1] = anglesVet[1] + angle;
    }
    if (keyboard.pressed(".")){
        mockBaseSphere.rotateOnAxis(camY, -angle);
        //mockBaseSphere.matrix.multiply(mat4.makeRotationY(-angle));
        mockPlane.rotateOnAxis(camY, +angle);
        pressed[1] = true;
        anglesVet[1] = anglesVet[1] - angle;
        */
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
    if (keyboard.up("left")){ // keep camera steady
        //mockBaseSphere.rotateOnAxis(camY, angle);
        //mockPlane.rotateOnAxis(camY, -angle);
        pressed[1] = false;
    }
    if (keyboard.up("right")){
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
    angle = angle * 3; // faz o avião retornar à origem mais rapidamente que o movimento feito pelo usuário
    if(!pressed[1]){
        if(anglesVet[1]<0){
            //mockBaseSphere.rotateOnAxis(camY, angle);
            baseCylinder.rotateOnAxis(camY, -angle);
            //pressed[1] = f;
            anglesVet[1] = anglesVet[1] + angle;
            
            if(anglesVet[1]>=0){
                //anglesVet[1]=0;
                baseCylinder.rotateY(anglesVet[1]);
                anglesVet[1]=0;
            }
        } else if(anglesVet[1]>0){
            //mockBaseSphere.rotateOnAxis(camY, -angle);
            baseCylinder.rotateOnAxis(camY, +angle);
            //pressed[1] = f;
            anglesVet[1] = anglesVet[1] - angle;
            
            if(anglesVet[1]<=0){
                //anglesVet[1]=0;
                baseCylinder.rotateY(anglesVet[1]);
                anglesVet[1]=0;
                //baseCylinder.rotateY(0);
            }
        }
    }

    //angle = angle * 2; // faz o movimento lateral ser mais rápido que o da altura
    if(!pressed[0]){
        if(anglesVet[0]<0){
            //mockBaseSphere.rotateOnAxis(camX, angle);
            baseCylinderTeste.rotateOnAxis(camX, +angle);
            //pressed[1] = f;
            anglesVet[0] = anglesVet[0] + angle;
            
            if(anglesVet[0]>=0){
                anglesVet[0]=0;
            }
        } else if(anglesVet[0]>0){
            //mockBaseSphere.rotateOnAxis(camX, -angle);
            baseCylinderTeste.rotateOnAxis(camX, -angle);
            //pressed[1] = f;
            anglesVet[0] = anglesVet[0] - angle;
            
            if(anglesVet[0]<=0){
                anglesVet[0]=0;
            }
        }
    }
    
}

// Set angles of rotation
//var baseAnimationSpeed = 0.2; // defines base animation speed
//var speedBlade = baseAnimationSpeed;
var animationOn = true; // control if animation is on or of

function rotateBlades(){
  // takes back matrix control
  hub.matrixAutoUpdate = false;
  blade.matrixAutoUpdate = false;
  leftHub.matrixAutoUpdate = false;
  leftBlade.matrixAutoUpdate = false;
  rightHub.matrixAutoUpdate = false;
  rightBlade.matrixAutoUpdate = false;

  if(animationOn){
    // defines angular speed
    
    var mat4 = new THREE.Matrix4();
    //hub.matrix.identity();  // reset matrix
    blade.matrix.identity();  // reset matrix
    leftBlade.matrix.identity();  // reset matrix
    rightBlade.matrix.identity();  // reset matrix

    // Will execute rotation
    hub.matrix.multiply(mat4.makeRotationY(speed*2/2)); // R1
    rightHub.matrix.multiply(mat4.makeRotationY(-speed*2)); // R1
    leftHub.matrix.multiply(mat4.makeRotationY(speed*2)); // R1
  }
}


function showInformation()
{
  // Use this to show information onscreen
    var controls = new InfoBox();
    controls.add("Flight Simulator controls:");
    controls.addParagraph();
    controls.add("Press arrow keys to change airplane direction");
    //controls.add("Press , (comma) or . (point) to change camera angle"); // movement disabled
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
    //mockBaseSphere.translateY(speed);
    rotateBlades();
}
render();
