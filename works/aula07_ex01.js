import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians, 
        createLightSphere} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  //camera.position.set(2.18, 1.62, 3.31);
  camera.position.set(0.0, 3.0, 6.0);
  camera.up.set( 0, 1, 0 );
//var objColor = "rgb(255,20,20)";
var objColor = "rgb(255,255,255)"; // white
var objShininess = 200;

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(4.0, 2.5, 50, 50); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Show text information onscreen
showInformation();

var infoBox = new SecondaryBox("");

// Teapot
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({color:objColor, shininess:"200"});
  material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Control available light and set the active light
//var lightArray = new Array();
//var activeLight = 0; // View first Light
//var lightIntensity = 1.0;

//---------------------------------------------------------
// Default light position, color, ambient color and intensity
//var lightPosition = new THREE.Vector3(1.7, 0.8, 1.1);
//var lightColor = "rgb(255,255,255)";
var ambientColor = "rgb(50,50,50)";

// Sphere to represent the light
//var lightSphere = createLightSphere(scene, 0.05, 10, 10, lightPosition);

//---------------------------------------------------------
// Create and set all lights. Only Spot and ambient will be visible at first
//var spotLight = new THREE.SpotLight(lightColor);
//setSpotLight(lightPosition);

// TRACKS
// Define materials
var frontTrackGeometry = new THREE.BoxGeometry(4.5, 0.01, 0.01);
var sideTracksGeometry = new THREE.BoxGeometry(0.01, 0.01, 3.0);
var trackMaterial = new THREE.MeshBasicMaterial( {color: "white"} );
// front
var frontTrack = new THREE.Mesh(frontTrackGeometry, trackMaterial);
frontTrack.position.set(0.0, 1.2, 1.5);
scene.add(frontTrack);

// right
var rightTrack = new THREE.Mesh(sideTracksGeometry, trackMaterial);
rightTrack.position.set(2.25, 1.2, 0.0);
scene.add(rightTrack);
// left
var leftTrack = new THREE.Mesh(sideTracksGeometry, trackMaterial);
leftTrack.position.set(-2.25, 1.2, 0.0);
scene.add(leftTrack);

// LIGHTS
// Red light
var redSpotLight = new THREE.SpotLight("rgb(255,20,20)"); // red spotlight
var redLightPosition = new THREE.Vector3(0.0, 1.2, 1.5); // red light initial position
var redLightId = 0; // unique id
setSpotLights(redLightPosition, redLightId);

// Defines red light sphere
var geometryLightsSphere = new THREE.SphereGeometry(0.05, 10, 10, 0, Math.PI * 2, 0, Math.PI);
var materialRedLightSphere = new THREE.MeshBasicMaterial({color:"rgb(255,20,20)"});
var redLightSphere = new THREE.Mesh(geometryLightsSphere, materialRedLightSphere);
//redLightSphere.visible = true;
redLightSphere.position.copy(redLightPosition);
scene.add(redLightSphere);

// Blue light
var blueSpotLight = new THREE.SpotLight("rgb(0,0,255)"); // blue spotlight
var blueLightPosition = new THREE.Vector3(2.25, 1.2, 0.0); // blue light initial position
var blueLightId = 1; // unique id
setSpotLights(blueLightPosition, blueLightId);

// Defines blue light sphere
var materialBlueLightSphere = new THREE.MeshBasicMaterial({color:"rgb(0,0,255)"});
var blueLightSphere = new THREE.Mesh(geometryLightsSphere, materialBlueLightSphere);
//blueLightSphere.visible = true;
blueLightSphere.position.copy(blueSpotLight);
scene.add(blueLightSphere);

// Green light
var greenSpotLight = new THREE.SpotLight("rgb(0,255,0)"); // green spotlight
var greenLightPosition = new THREE.Vector3(-2.25, 1.2, 0.0); // green light initial position
var greenLightId = 2; // unique id
setSpotLights(greenLightPosition, greenLightId);

// Defines green light sphere
var materialGreenLightSphere = new THREE.MeshBasicMaterial({color:"rgb(0,255,0)"});
var greenLightSphere = new THREE.Mesh(geometryLightsSphere, materialGreenLightSphere);
//greenLightSphere.visible = true;
greenLightSphere.position.copy(greenSpotLight);
scene.add(greenLightSphere);

/*var pointLight = new THREE.PointLight(lightColor);
setPointLight(lightPosition);

var dirLight = new THREE.DirectionalLight(lightColor);
setDirectionalLighting(lightPosition);*/

// More info here: https://threejs.org/docs/#api/en/lights/AmbientLight
var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add( ambientLight );

buildInterface();
render();

// Set Point Light
// More info here: https://threejs.org/docs/#api/en/lights/PointLight
/*function setPointLight(position)
{
  pointLight.position.copy(position);
  pointLight.name = "Point Light"
  pointLight.castShadow = true;
  pointLight.visible = false;
  spotLight.penumbra = 0.5;
  
  scene.add( pointLight );
  lightArray.push( pointLight );
}*/

// Set Spotlight
// More info here: https://threejs.org/docs/#api/en/lights/SpotLight
/*function setSpotLight(position)
{
  spotLight.position.copy(position);
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.angle = degreesToRadians(40);    
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.5;
  spotLight.name = "Spot Light"

  scene.add(spotLight);
  lightArray.push( spotLight );
}*/

function setSpotLights(position, id)
{
  if(id == 0){
    redSpotLight.position.copy(position);
    redSpotLight.shadow.mapSize.width = 512;
    redSpotLight.shadow.mapSize.height = 512;
    redSpotLight.angle = degreesToRadians(40);    
    redSpotLight.castShadow = true;
    redSpotLight.decay = 2;
    redSpotLight.penumbra = 0.5;
    redSpotLight.name = "Red Spot Light"

    scene.add(redSpotLight);
  }
  if(id == 1){
    blueSpotLight.position.copy(position);
    blueSpotLight.shadow.mapSize.width = 512;
    blueSpotLight.shadow.mapSize.height = 512;
    blueSpotLight.angle = degreesToRadians(40);    
    blueSpotLight.castShadow = true;
    blueSpotLight.decay = 2;
    blueSpotLight.penumbra = 0.5;
    blueSpotLight.name = "Blue Spot Light"

    scene.add(blueSpotLight);
  }
  if(id == 2){
    greenSpotLight.position.copy(position);
    greenSpotLight.shadow.mapSize.width = 512;
    greenSpotLight.shadow.mapSize.height = 512;
    greenSpotLight.angle = degreesToRadians(40);    
    greenSpotLight.castShadow = true;
    greenSpotLight.decay = 2;
    greenSpotLight.penumbra = 0.5;
    greenSpotLight.name = "Green Spot Light"

    scene.add(greenSpotLight);
  }
}

// Set Directional Light
// More info here: https://threejs.org/docs/#api/en/lights/DirectionalLight
/*function setDirectionalLighting(position)
{
  dirLight.position.copy(position);
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.castShadow = true;

  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 20;
  dirLight.shadow.camera.left = -5;
  dirLight.shadow.camera.right = 5;
  dirLight.shadow.camera.top = 5;
  dirLight.shadow.camera.bottom = -5;
  dirLight.name = "Direction Light";
  dirLight.visible = false;

  scene.add(dirLight);
  lightArray.push( dirLight );
}*/

// Update light position of the current light
/*function updateLightPosition()
{
  lightArray[activeLight].position.copy(lightPosition);
  lightSphere.position.copy(lightPosition);
  infoBox.changeMessage("Light Position: " + lightPosition.x.toFixed(2) + ", " +
                          lightPosition.y.toFixed(2) + ", " + lightPosition.z.toFixed(2));
}*/

// Update light position of the spot lights
function updateLightsPosition(id)
{
  //lightArray[activeLight].position.copy(lightPosition);
  if (id == 0){
    redSpotLight.position.copy(redLightPosition);
    redLightSphere.position.copy(redLightPosition);
    infoBox.changeMessage("Red Light Position: " + redLightPosition.x.toFixed(2) + ", " +
                          redLightPosition.y.toFixed(2) + ", " + redLightPosition.z.toFixed(2));
  }
  if (id == 1){
    blueSpotLight.position.copy(blueLightPosition);
    blueLightSphere.position.copy(blueLightPosition);
    infoBox.changeMessage("Blue Light Position: " + blueLightPosition.x.toFixed(2) + ", " +
                          blueLightPosition.y.toFixed(2) + ", " + blueLightPosition.z.toFixed(2));
  }
  if (id == 2){
    greenSpotLight.position.copy(greenLightPosition);
    greenLightSphere.position.copy(greenLightPosition);
    infoBox.changeMessage("Green Light Position: " + greenLightPosition.x.toFixed(2) + ", " +
                          greenLightPosition.y.toFixed(2) + ", " + greenLightPosition.z.toFixed(2));
  }
}

// Update light intensity of the current light
/*function updateLightIntensity()
{
  lightArray[activeLight].intensity = lightIntensity;
}*/

function buildInterface()
{
  //------------------------------------------------------------
  // Interface
  var controls = new function ()
  {
    this.viewAxes = false;
    //this.color = objColor;
    //this.shininess = objShininess;
    //this.lightIntensity = lightIntensity;
    //this.lightType = 'Spot'
    this.ambientLight = true;
    this.redSpotLight = true; // initial state
    this.blueSpotLight = true; // initial state
    this.greenSpotLight = true; // initial state

    this.onViewAxes = function(){
      axesHelper.visible = this.viewAxes;
    };
    this.onEnableAmbientLight = function(){
      ambientLight.visible = this.ambientLight;
    };
    this.onEnableRedLight = function(){ // Red light power toggle
      redSpotLight.visible = this.redSpotLight;
    };
    this.onEnableBlueLight = function(){ // Blue light power toggle
      blueSpotLight.visible = this.blueSpotLight;
    };
    this.onEnableGreenLight = function(){ // Green light power toggle
      greenSpotLight.visible = this.greenSpotLight;
    };
    
    /*this.updateColor = function(){
      material.color.set(this.color);
    };
    this.onUpdateShininess = function(){
      material.shininess = this.shininess;
    };
    this.onUpdateLightIntensity = function(){
      lightIntensity = this.lightIntensity;
      updateLightIntensity();
    };
    this.onChangeLight = function()
    {
      lightArray[activeLight].visible = false;
      switch (this.lightType)
      {
        case 'Spot':
            activeLight = 0;
            break;
        case 'Point':
            activeLight = 1;
            break;
        case 'Direction':
            activeLight = 2;
            break;
      }
      lightArray[activeLight].visible = true;
      updateLightPosition();
      updateLightIntensity();
    };*/
  };

  var gui = new GUI();
  /*gui.addColor(controls, 'color')
    .name("Obj Color")
    .onChange(function(e) { controls.updateColor() });*/
  /*gui.add(controls, 'shininess', 0, 1000)
    .name("Obj Shininess")
    .onChange(function(e) { controls.onUpdateShininess() });*/
  gui.add(controls, 'viewAxes', false)
    .name("View Axes")
    .onChange(function(e) { controls.onViewAxes() });
  /*gui.add(controls, 'lightType', ['Spot', 'Point', 'Direction'])
    .name("Light Type")
    .onChange(function(e) { controls.onChangeLight(); });*/
  /*gui.add(controls, 'lightIntensity', 0, 5)
    .name("Light Intensity")
    .onChange(function(e) { controls.onUpdateLightIntensity() });*/
  gui.add(controls, 'ambientLight', true)
    .name("Ambient Light")
    .onChange(function(e) { controls.onEnableAmbientLight() });
  gui.add(controls, 'redSpotLight', true)
    .name("Red Spot Light")
    .onChange(function(e) { controls.onEnableRedLight() });
  gui.add(controls, 'blueSpotLight', true)
    .name("Blue Spot Light")
    .onChange(function(e) { controls.onEnableBlueLight() });
  gui.add(controls, 'greenSpotLight', true)
    .name("Green Spot Light")
    .onChange(function(e) { controls.onEnableGreenLight() });
}

function keyboardUpdate()
{
  keyboard.update();
  if ( keyboard.pressed("D") ) // move red light to right
  {
    if (redLightPosition.x <= 2.2){ // limit the movement only when on track
      redLightPosition.x += 0.05;
      updateLightsPosition(redLightId);
    }
    
  }
  if ( keyboard.pressed("A") ) // move red light to left
  {
    if (redLightPosition.x >= -2.2){ // limit the movement only when on track
      redLightPosition.x -= 0.05;
      updateLightsPosition(redLightId);
    }
  }
  if ( keyboard.pressed("Z") )
  {
    if (greenLightPosition.z <= 1.5){ // limit the movement only when on track
      greenLightPosition.z += 0.05;
      updateLightsPosition(greenLightId);
    }
  }
  if ( keyboard.pressed("C") )
  {
    if (greenLightPosition.z >= -1.5){ // limit the movement only when on track
      greenLightPosition.z -= 0.05;
      updateLightsPosition(greenLightId);
    }
  }
  if ( keyboard.pressed("E") ) // move blue light to the front
  {
    if (blueLightPosition.z <= 1.5){ // limit the movement only when on track
      blueLightPosition.z += 0.05;
      updateLightsPosition(blueLightId);
    }
  }
  if ( keyboard.pressed("Q") ) // move blue light backwards
  {
    if (blueLightPosition.z >= -1.5){ // limit the movement only when on track
      blueLightPosition.z -= 0.05;
      updateLightsPosition(blueLightId);
    }
  }
}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Lighting - Types of Lights");
    controls.addParagraph();
    controls.add("Use the WASD-QE keys to move the light");
    controls.show();
}

function render()
{
  stats.update();
  trackballControls.update();
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
