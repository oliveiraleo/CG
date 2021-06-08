import * as THREE from          '../build/three.module.js';
import Stats from               '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {GUI} from               '../build/jsm/libs/dat.gui.module.js';
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
var planeGeometry = new THREE.PlaneGeometry(25, 25);
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


// fuselage
// define airplane wings geometry
var wingsGeometry = new THREE.BoxGeometry(10.0, 3.0, 0.2);
// create the right wing
var rightWing = new THREE.Mesh(wingsGeometry, material);
//rightWing.position.set(4.0, 0.0, 2.5);
rightWing.position.set(6.5, 0.0, 0.0);
// create the left wing
var leftWing = new THREE.Mesh(wingsGeometry, material);
leftWing.position.set(-6.5, 0.0, 0.0);

// create the base cylinder
var baseCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 7, 32);
var baseCylinder = new THREE.Mesh(baseCylinderGeometry, material);
baseCylinder.position.set(0.0, 0.0, 2.5);
// rotate to 90° angle
//cylinder.rotateX(degreesToRadians(90));
baseCylinder.add(rightWing);
baseCylinder.add(leftWing);

// create the rear cylinder
var backCylinderGeometry = new THREE.CylinderGeometry(1.5, 0.5, 5, 32);
var backCylinder = new THREE.Mesh(backCylinderGeometry, material);
backCylinder.position.set(0.0, -6.0, 0.0);

// create tail cylinder
var tailCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
var tailCylinder = new THREE.Mesh(tailCylinderGeometry, material);
tailCylinder.position.set(0.0, -3.0, 0.0);

// define airplane stabilizers geometry
var verticalStabilizerGeometry = new THREE.BoxGeometry(3, 1, 0.2);
var horizontalStabilizerGeometry = new THREE.BoxGeometry(0.2, 0.5, 2);
// create the right stabilizer
var rightStabilizer = new THREE.Mesh(verticalStabilizerGeometry, material);
rightStabilizer.position.set(2.0, 0.0, 0.0);
// create the left stabilizer
var leftStabilizer = new THREE.Mesh(verticalStabilizerGeometry, material);
leftStabilizer.position.set(-2.0, 0.0, 0.0);
// create horizontal stabilizer
var horizontalStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, material);
horizontalStabilizer.position.set(0.0, -0.25, 1.5);

// create the front cylinder
var frontCylinderGeometry = new THREE.CylinderGeometry(0.5, 1.5, 2, 32);
var frontCylinder = new THREE.Mesh(frontCylinderGeometry, material);
frontCylinder.position.set(0.0, 4.5, 0.0);
baseCylinder.add(frontCylinder);
baseCylinder.add(backCylinder);
backCylinder.add(tailCylinder);
tailCylinder.add(leftStabilizer);
tailCylinder.add(rightStabilizer);
tailCylinder.add(horizontalStabilizer);


// propeller
// create blades hub
var hubGeometry = new THREE.ConeGeometry(0.5, 1.0, 32);
var hub = new THREE.Mesh(hubGeometry, material);
//hub.position.set(0.0, 6.0, 2.5);
//hub.position.set(0.0, 2.5, 0.0);
// define blades geometry
var bladesGeometry = new THREE.BoxGeometry(0.2, 0.05, 5.0);
// create blades
var topBlade = new THREE.Mesh(bladesGeometry, material);
//topBlade.position.set(0.0, 0.0, 0.0);
var leftBlade = new THREE.Mesh(bladesGeometry, material);
//leftBlade.position.set(0.0, 6.0, 2.5);
leftBlade.rotateY(degreesToRadians(-60));
var rightBlade = new THREE.Mesh(bladesGeometry, material);
//rightBlade.position.set(0.0, 6.0, 2.5);
rightBlade.rotateY(degreesToRadians(60));
// adds all blades to the hub
hub.add(topBlade);
//hub.add(leftBlade);
//hub.add(rightBlade);
// Base hub sphere
var hubBaseSphereGeometry = new THREE.SphereGeometry(0.01, 2, 2);
var hubBaseSphere = new THREE.Mesh( hubBaseSphereGeometry, material );
// Set initial position of the sphere
hubBaseSphere.translateX(0.0).translateY(1.5).translateZ(0.0);
//hubBaseSphere.rotateY(degreesToRadians(90));
// adds the hub to the base sphere
hubBaseSphere.add(hub);
//hubBaseSphere.add(leftBlade);
frontCylinder.add(hubBaseSphere);

// landing gear
// creates tires geometry
var tiresGeometry = new THREE.TorusGeometry(0.2, 0.1, 8, 24);
// front
var frontTire = new THREE.Mesh(tiresGeometry, material);
frontTire.position.set(0.0, 2.0, -2.2);
// back left
var backLeftTire = new THREE.Mesh(tiresGeometry, material);
backLeftTire.position.set(-1.5, -3.0, -2.2);
// back right
var backRightTire = new THREE.Mesh(tiresGeometry, material);
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
var shockStrut = new THREE.Mesh(shockStrutGeometry, material);
shockStrut.position.set(0.2, 2.0, -1.9);
// create 2nd front shock strut
var shockStrut2 = new THREE.Mesh(shockStrutGeometry, material);
shockStrut2.position.set(-0.2, 2.0, -1.9);
// create front tire cylinder axis
var frontTireCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 32);
var frontTireCylinder = new THREE.Mesh(frontTireCylinderGeometry, material);
frontTireCylinder.rotateZ(degreesToRadians(90));
frontTireCylinder.position.set(0.0, 2.0, -2.2);
// create back left shock strut
var backLeftShockStrut = new THREE.Mesh(backShockStrutsGeometry, material);
backLeftShockStrut.position.set(-0.9, -3.0, -1.75);
// rotate to 90° angle
backLeftShockStrut.rotateY(degreesToRadians(45));
// create back right shock strut
var backRightShockStrut = new THREE.Mesh(backShockStrutsGeometry, material);
backRightShockStrut.position.set(0.9, -3.0, -1.75);
// rotate to 90° angle
backRightShockStrut.rotateY(degreesToRadians(-45));
// create back tire cylinder axis
var backTiresCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3.0, 32);
var backTiresCylinder = new THREE.Mesh(backTiresCylinderGeometry, material);
backTiresCylinder.rotateZ(degreesToRadians(90));
backTiresCylinder.position.set(0.0, -3.0, -2.2);

baseCylinder.add(shockStrut);
baseCylinder.add(shockStrut2);
baseCylinder.add(frontTireCylinder);
baseCylinder.add(frontTire);
baseCylinder.add(backLeftShockStrut);
baseCylinder.add(backRightShockStrut);
baseCylinder.add(backTiresCylinder);
baseCylinder.add(backLeftTire);
baseCylinder.add(backRightTire);


// create the pilot's cockpit
var cockpitGeometry = new THREE.SphereGeometry(1, 32, 32);
var cockpit = new THREE.Mesh(cockpitGeometry, material);
cockpit.position.set(0.0, -1.5, 1.25);
baseCylinder.add(cockpit);

// Joins every airplane part togheter
// TODO here

// add the objects to the scene
// fuselage
//scene.add(frontCylinder);
//scene.add(rightWing);
//scene.add(leftWing);
scene.add(baseCylinder);
//scene.add(cockpit);
//scene.add(backCylinder);
// propeller
//scene.add(hubBaseSphere);
//scene.add(hub);
//scene.add(topBlade);
//scene.add(leftBlade);
//scene.add(rightBlade);
// tail
//scene.add(tailCylinder);
//scene.add(leftStabilizer);
//scene.add(rightStabilizer);
//scene.add(horizontalStabilizer);
// landing gear
//scene.add(shockStrut);
//scene.add(shockStrut2);
//scene.add(frontTireCylinder);
//scene.add(backLeftShockStrut);
//scene.add(backRightShockStrut);
//scene.add(frontTire);
//scene.add(backRightTire);
//scene.add(backLeftTire);

// Set angles of rotation
var angle = 0.0;
//var angle2 = 0;
var baseAnimationSpeed = 0.2; // defines base animation speed
var speed = baseAnimationSpeed;
var animationOn = true; // control if animation is on or of

function rotateBlades(){
  // takes back matrix control
  hub.matrixAutoUpdate = false;
  topBlade.matrixAutoUpdate = false;
  leftBlade.matrixAutoUpdate = false;
  rightBlade.matrixAutoUpdate = false;

  if(animationOn){
    // defines angular speed
    angle+=speed;
    //angle2+=speed*2;
    
    var mat4 = new THREE.Matrix4();
    //hub.matrix.identity();  // reset matrix
    topBlade.matrix.identity();  // reset matrix
    leftBlade.matrix.identity();  // reset // TODO correct blades angles
    rightBlade.matrix.identity(); // reset

    // Will execute rotation
    hub.matrix.multiply(mat4.makeRotationY(speed)); // R1
    //leftBlade.matrix.multiply(mat4.makeRotationY(-speed)); // R1
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