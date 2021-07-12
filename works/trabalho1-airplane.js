import * as THREE from          '../build/three.module.js';
import Stats from               '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {GUI} from               '../build/jsm/libs/dat.gui.module.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        degreesToRadians,
        initDefaultBasicLight,
        initDefaultSpotlight,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position
initDefaultBasicLight(scene, 1, new THREE.Vector3(0, 0, 15)); // Adds some light to the scene
//initDefaultSpotlight(scene, new THREE.Vector3(0.0, 0.0, 25.0)); // Adds a spotlight to the scene

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// FPS panel config
function createStats() {
  stats.setMode(0);
  
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0';
  stats.domElement.style.top = '0';

  return stats;
}
// To show FPS
stats = createStats();
document.body.appendChild( stats.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );
// TODO move axes helper to the side

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)", // light grey
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the ground plane to the scene
scene.add(plane);

// define objects material
var material = new THREE.MeshNormalMaterial();
var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var bladesMaterial = new THREE.MeshPhongMaterial({color:"white", reflectivity:"1.0"});
var cockpitMaterial = new THREE.MeshPhongMaterial({color:"white", reflectivity:"0.5", transparent:"true", opacity:"0.6"});
var tailMaterial = new THREE.MeshPhongMaterial({color:"orange", emissive:"rgb(255, 100, 0)", emissiveIntensity:"0.75"}); // bright orange
var tiresMaterial = new THREE.MeshPhongMaterial({color:"black"}); 
var hubMaterial = new THREE.MeshPhongMaterial({color:"red"});
var stabilizersMaterial = new THREE.MeshPhongMaterial({color:"blue"});
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
baseCylinder.position.set(0.0, 0.0, 2.5);

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
var bladeGeometry = new THREE.BoxGeometry(0.2, 0.05, 5.0);
var wingsBladeGeometry = new THREE.BoxGeometry(0.2, 0.05, 4.0);
// create blades
var blade = new THREE.Mesh(bladeGeometry, bladesMaterial);
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
var leftBlade = new THREE.Mesh(wingsBladeGeometry, bladesMaterial);
var rightHub = new THREE.Mesh(hubGeometry, hubMaterial);
var rightBlade = new THREE.Mesh(wingsBladeGeometry, bladesMaterial);
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

// add all objects to the scene
scene.add(baseCylinder); // adds the whole airplane to the scene


// Set angles of rotation
var angle = 0.0;
var baseAnimationSpeed = 0.2; // defines base animation speed
var speed = baseAnimationSpeed;
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
    angle+=speed;
    
    var mat4 = new THREE.Matrix4();
    //hub.matrix.identity();  // reset matrix
    blade.matrix.identity();  // reset matrix
    leftBlade.matrix.identity();  // reset matrix
    rightBlade.matrix.identity();  // reset matrix

    // Will execute rotation
    hub.matrix.multiply(mat4.makeRotationY(speed/2)); // R1
    rightHub.matrix.multiply(mat4.makeRotationY(-speed)); // R1
    leftHub.matrix.multiply(mat4.makeRotationY(speed)); // R1
  }
}

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Airplane Preview");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.addParagraph();
  controls.add("TIP: Use upper panel to control the animation");
  controls.show();

  // shows blade rotation speed control
  function buildInterface()
  {
    var controls = new function ()
    {
      this.onChangeAnimation = function(){
        animationOn = !animationOn;
      };
      this.speed = baseAnimationSpeed;
  
      this.changeSpeed = function(){
        speed = (this.speed);
      };
    };
  
    // GUI interface
    var gui = new GUI();
    gui.add(controls, 'onChangeAnimation',true).name("Animation");
    gui.add(controls, 'speed', 0.1, 1.0) // defines speeds intervals
      .onChange(function(e) { controls.changeSpeed() })
      .name("Speed");
  }
  
  buildInterface();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  rotateBlades(); // Enable blades rotation
  renderer.render(scene, camera) // Render scene
}
