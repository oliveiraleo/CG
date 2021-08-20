import * as THREE from  '../build/three.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import Stats from               '../build/jsm/libs/stats.module.js';
import KeyboardState from       '../libs/util/KeyboardState.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import {initRenderer, 
        //createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians,
        //initDefaultBasicLight,
        //initCamera,
        //BufferGeometry,
        //ConvexGeometry,
        SecondaryBox,
        InfoBox,
        radiansToDegrees} from "../libs/util/util.js";

import { gerarArvores } from './classes/arvore.js';
import {Aviao} from './classes/aviao.js';

var stats = new Stats();        // To show FPS information
var scene = new THREE.Scene();  // create scene
var renderer = initRenderer();  // View function in util/utils
//initDefaultBasicLight(scene, 1, new THREE.Vector3(0, 0, 25)); // Adds some light to the scene
var information = new SecondaryBox(""); // to display the secondary information later
//-----------------------------------//
// SCENE LIGHTS CONFIGURATION BEGIN  //
//-----------------------------------//
// Adds some lights to the scene
//var hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
var hemisphereLight = new THREE.HemisphereLight( "white", "white", 0.75 );
scene.add( hemisphereLight );
// White directional light shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75 );
// Directional light configs
// shadow resolution
directionalLight.shadow.mapSize.width = 8192;
directionalLight.shadow.mapSize.height = 8192;
//directionalLight.penunbra = 0.7; TODO config this
// area where shadows appear // 500 x 500 = size of ground plane
directionalLight.shadow.camera.left = -500;
directionalLight.shadow.camera.right = 500;
directionalLight.shadow.camera.top = 500;
directionalLight.shadow.camera.bottom = -500;
// near and far
directionalLight.shadow.camera.near = 20; // default 0.5
directionalLight.shadow.camera.far = 151; // default 500 // 151 because 150 didn't reach the ground plane
// enable shadows
directionalLight.castShadow = true;
// directional light position
directionalLight.position.set(0, 0, 150); // 120 is the big mountain height, so higher than that
var directionalLightHelper = new THREE.CameraHelper( directionalLight.shadow.camera ); // creates a helper to better visualize the light
// add to the scene
scene.add( directionalLightHelper );
scene.add( directionalLight );
directionalLightHelper.visible = false; // comment to display the helper
//-----------------------------------//
// SCENE LIGHTS CONFIGURATION END    //
//-----------------------------------//

//remover camera
//var camera = initCamera(new THREE.Vector3(0, -500, 15)); // Init camera in this position

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

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 100 );
// Replace the helper to better visualize it
//axesHelper.translateY(20);
axesHelper.translateX(-250);

// create the ground plane
var groundPlaneGeometry = new THREE.PlaneGeometry(1000, 1000);
groundPlaneGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var groundPlaneMaterial = new THREE.MeshLambertMaterial({
    //color: "rgba(150, 150, 150)", // light grey
    color: "green",
});
var groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
// add the ground plane to the scene
groundPlane.receiveShadow = true; // enables shadows
scene.add(groundPlane);
groundPlane.add(axesHelper);

//-----------------------------------//
// MOUNTAINS CONFIGURATION BEGIN     //
//-----------------------------------//
var mountainScaleSmall = 3;
var mountainScaleMedium = 5;
var mountainScaleHigh = 10;
// Small mountain
var points1 = [// cume
              new THREE.Vector3( 0.0 * mountainScaleSmall, 1.0 * mountainScaleSmall, 6.0 * mountainScaleSmall ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 2.0 * mountainScaleSmall, 8.5 * mountainScaleSmall ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 4.0 * mountainScaleSmall, 8.0 * mountainScaleSmall ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 6.0 * mountainScaleSmall, 8.0 * mountainScaleSmall ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 8.0 * mountainScaleSmall, 4.0 * mountainScaleSmall ),
              new THREE.Vector3( 5.0 * mountainScaleSmall, 5.0 * mountainScaleSmall, 6.0*mountainScaleSmall ),
              new THREE.Vector3( -4.0*mountainScaleSmall, 2.0*mountainScaleSmall, 3.0*mountainScaleSmall ),
              // base
              new THREE.Vector3( 0.0, 0.0, 0.0 ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 10.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( 10.0 * mountainScaleSmall, 10.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( -5.0 * mountainScaleSmall, 5.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( 6.0 * mountainScaleSmall, 2.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( 5.0 * mountainScaleSmall, 12.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( 7.0 * mountainScaleSmall, 5.0 * mountainScaleSmall, 0.0 )
            ];

var points2 = [// cume
                new THREE.Vector3( 0.0 * mountainScaleSmall, -1.0 * mountainScaleSmall, 6.0 * mountainScaleSmall ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, -2.0 * mountainScaleSmall, 10.0 * mountainScaleSmall ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, -4.0 * mountainScaleSmall, 8.0 * mountainScaleSmall ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, -6.0 * mountainScaleSmall, 8.0 * mountainScaleSmall ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, -8.0 * mountainScaleSmall, 4.0 * mountainScaleSmall ),
                new THREE.Vector3( 5.0 * mountainScaleSmall, -5.0 * mountainScaleSmall, 6.0 * mountainScaleSmall ),
                new THREE.Vector3( -4.0 * mountainScaleSmall, -2.0 * mountainScaleSmall, 3.0 * mountainScaleSmall ),
                // base
                new THREE.Vector3( 0.0, 0.0, 0.0 ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, 10.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( 10.0 * mountainScaleSmall, 8.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( -5.0 * mountainScaleSmall, -5.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( 6.0 * mountainScaleSmall, 2.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( 5.0 * mountainScaleSmall, -12.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( 7.0 * mountainScaleSmall, 5.0 * mountainScaleSmall, 0.0 * mountainScaleSmall )
            ];
// Medium mountain
var points3 = [// cume
                new THREE.Vector3( 0.0 * mountainScaleMedium, -1.0 * mountainScaleMedium, 6.0 * mountainScaleMedium ),
                new THREE.Vector3( 0.0 * mountainScaleMedium, -2.0 * mountainScaleMedium, 10.0 * mountainScaleMedium ),
                new THREE.Vector3( 0.0 * mountainScaleMedium, -4.0 * mountainScaleMedium, 8.0 * mountainScaleMedium ),
                new THREE.Vector3( 0.0 * mountainScaleMedium, -6.0 * mountainScaleMedium, 8.0 * mountainScaleMedium ),
                new THREE.Vector3( 0.0 * mountainScaleMedium, -8.0 * mountainScaleMedium, 4.0 * mountainScaleMedium ),
                new THREE.Vector3( 5.0 * mountainScaleMedium, -5.0 * mountainScaleMedium, 6.0 * mountainScaleMedium ),
                new THREE.Vector3( -4.0 * mountainScaleMedium, -2.0 * mountainScaleMedium, 3.0 * mountainScaleMedium ),
                // base
                new THREE.Vector3( 0.0, 0.0, 0.0 ),
                new THREE.Vector3( 0.0 * mountainScaleMedium, 10.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                new THREE.Vector3( 10.0 * mountainScaleMedium, 8.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                new THREE.Vector3( -5.0 * mountainScaleMedium, -5.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                new THREE.Vector3( 6.0 * mountainScaleMedium, 2.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                new THREE.Vector3( 5.0 * mountainScaleMedium, -12.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                new THREE.Vector3( 7.0 * mountainScaleMedium, 5.0 * mountainScaleMedium, 0.0 * mountainScaleMedium )
                ];

var points4 = [// cume
                    new THREE.Vector3( 0.0 * mountainScaleMedium, -1.0 * mountainScaleMedium, 6.0 * mountainScaleMedium ),
                    new THREE.Vector3( 0.0 * mountainScaleMedium, -2.0 * mountainScaleMedium, 10.0 * mountainScaleMedium ),
                    //new THREE.Vector3( 0.0 * mountainScaleMedium, -4.0 * mountainScaleMedium, 8.0 * mountainScaleMedium ),
                    //new THREE.Vector3( 0.0 * mountainScaleMedium, -6.0 * mountainScaleMedium, 8.0 * mountainScaleMedium ),
                    new THREE.Vector3( 0.0 * mountainScaleMedium, -8.0 * mountainScaleMedium, 4.0 * mountainScaleMedium ),
                    new THREE.Vector3( 5.0 * mountainScaleMedium, -5.0 * mountainScaleMedium, 6.0 * mountainScaleMedium ),
                    new THREE.Vector3( -4.0 * mountainScaleMedium, -2.0 * mountainScaleMedium, 3.0 * mountainScaleMedium ),
                    // base
                    new THREE.Vector3( 0.0, 0.0, 0.0 ),
                    new THREE.Vector3( 0.0 * mountainScaleMedium, 6.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                    new THREE.Vector3( 10.0 * mountainScaleMedium, 8.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                    new THREE.Vector3( -5.0 * mountainScaleMedium, -5.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                    //new THREE.Vector3( 6.0 * mountainScaleMedium, 2.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                    //new THREE.Vector3( 5.0 * mountainScaleMedium, -12.0 * mountainScaleMedium, 0.0 * mountainScaleMedium ),
                    new THREE.Vector3( 7.0 * mountainScaleMedium, 5.0 * mountainScaleMedium, 0.0 * mountainScaleMedium )
                ];
// Big mountain
var points5 = [// cume
                new THREE.Vector3(0.0, 0.0, 12.0 * mountainScaleHigh), // pico mais alto
                // meio
                new THREE.Vector3(-3.0 * mountainScaleHigh, 0.0, 8.0 * mountainScaleHigh),
                new THREE.Vector3(3.0 * mountainScaleHigh, 0.0, 8.0 * mountainScaleHigh),

                new THREE.Vector3(0.0, -4.0 * mountainScaleHigh, 6.0 * mountainScaleHigh),
                new THREE.Vector3(0.0, 4.0 * mountainScaleHigh, 6.0 * mountainScaleHigh),
                // base
                new THREE.Vector3(8.0 * mountainScaleHigh, -3.0 * mountainScaleHigh, 0.0),
                new THREE.Vector3(-8.0 * mountainScaleHigh, 3.0 * mountainScaleHigh, 0.0),

                new THREE.Vector3(5.0 * mountainScaleHigh, 5.0 * mountainScaleHigh, 0.0),
                new THREE.Vector3(-5.0 * mountainScaleHigh, 5.0 * mountainScaleHigh, 0.0),
                new THREE.Vector3(-5.0 * mountainScaleHigh, -5.0 * mountainScaleHigh, 0.0),
                new THREE.Vector3(5.0 * mountainScaleHigh, -5.0 * mountainScaleHigh, 0.0)
];
var points6 = [// cume
                new THREE.Vector3(0.0, 0.0, 10.0 * mountainScaleHigh), // pico mais alto
                // meio
                new THREE.Vector3(-3.0 * mountainScaleHigh, 0.0, 8.0 * mountainScaleHigh),
                new THREE.Vector3(3.0 * mountainScaleHigh, 0.0, 8.0 * mountainScaleHigh),

                new THREE.Vector3(0.0, -4.0 * mountainScaleHigh, 6.0 * mountainScaleHigh),
                new THREE.Vector3(0.0, 4.0 * mountainScaleHigh, 6.0 * mountainScaleHigh),
                // base
                new THREE.Vector3(8.0 * mountainScaleHigh, -3.0 * mountainScaleHigh, 0.0),
                new THREE.Vector3(-8.0 * mountainScaleHigh, 3.0 * mountainScaleHigh, 0.0),

                new THREE.Vector3(5.0 * mountainScaleHigh*2, 5.0 * mountainScaleHigh, 0.0),
                new THREE.Vector3(-5.0 * mountainScaleHigh*2, 5.0 * mountainScaleHigh, 0.0),
                new THREE.Vector3(-5.0 * mountainScaleHigh*2, -5.0 * mountainScaleHigh, 0.0),
                new THREE.Vector3(5.0 * mountainScaleHigh*2, -5.0 * mountainScaleHigh, 0.0)
];
    
var geometry1 = new ConvexGeometry( points1 );
var geometry2 = new ConvexGeometry( points2 );

var geometry3 = new ConvexGeometry( points3 );
var geometry4 = new ConvexGeometry( points4 );

var geometry5 = new ConvexGeometry( points5 );
var geometry6 = new ConvexGeometry( points6 );
// mountain materials
var materialLand = new THREE.MeshLambertMaterial( { color:"rgb(80, 75, 0)" } ); // brown
var materialRock = new THREE.MeshLambertMaterial( { color:"rgb(120, 140, 130)" } ); // grey
var materialAsteroid = new THREE.MeshLambertMaterial( { color:"rgb(60, 80, 80)" } ); // deep grey
var materialBrick = new THREE.MeshLambertMaterial( { color:"rgb(210, 170, 60)" } ); // brick orange
// Small mountain
var mesh1 = new THREE.Mesh( geometry1, materialLand );
var mesh2 = new THREE.Mesh( geometry2, materialLand );
mesh1.position.set(-350,300,0);
groundPlane.add( mesh1 );
mesh1.add( mesh2 );
// Medium mountain
var mesh3 = new THREE.Mesh( geometry3, materialBrick );
var mesh4 = new THREE.Mesh( geometry4, materialAsteroid );
mesh3.position.set(250, 50, 0);
mesh4.position.set(0.0 * mountainScaleMedium, 0.0 * mountainScaleMedium, 8.5 * mountainScaleMedium);
mesh4.rotateX(90);
//groundPlane.add( mesh3 );
mesh3.add( mesh4 );
// Big mountain
var mesh5 = new THREE.Mesh( geometry5, materialRock );
var mesh6 = new THREE.Mesh( geometry6, materialRock );
var mesh7 = new THREE.Mesh( geometry6, materialRock );
//mesh4.position.set(0,-300,0); // centered at origin
mesh6.position.set( 0 * mountainScaleHigh, -3 * mountainScaleHigh, 0 * mountainScaleHigh);
mesh7.position.set( 3 * mountainScaleHigh, 3 * mountainScaleHigh, 0 * mountainScaleHigh);
mesh6.rotateZ(25);
mesh7.rotateZ(-90);
//groundPlane.add( mesh5 );
mesh5.add( mesh6 );
mesh6.add( mesh7 );

// mountains shadows
mesh1.receiveShadow = true;
mesh2.receiveShadow = true;
mesh3.receiveShadow = true;
mesh4.receiveShadow = true;
mesh5.receiveShadow = true;
mesh6.receiveShadow = true;
mesh7.receiveShadow = true;

mesh1.castShadow = true;
mesh2.castShadow = true;
mesh3.castShadow = true;
mesh4.castShadow = true;
mesh5.castShadow = true;
mesh6.castShadow = true;
mesh7.castShadow = true;
//-----------------------------------//
// MOUNTAINS CONFIGURATION END       //
//-----------------------------------//

//-----------------------------------//
// LANDING TRACK CONFIGURATION BEGIN //
//-----------------------------------//
// Landing track (pista de pouso)
var landingTrackLenghtY = 250.0;
var landingTrackLinesLenghtY = 15.0;
var landingTrackGeometry = new THREE.BoxGeometry(30.0, landingTrackLenghtY, 0.2);
var landingTrackMaterial = new THREE.MeshLambertMaterial({color:"rgb(60, 60, 60)"}); // light grey
// create the landing track
var landingTrack = new THREE.Mesh(landingTrackGeometry, landingTrackMaterial);
landingTrack.position.set(0.0, -350.0, 0.0);
landingTrack.receiveShadow = true;
//groundPlaneWired.add(landingTrack);
groundPlane.add(landingTrack);

var vetLandingLines = [];
var linesPosition = (landingTrackLenghtY / 2) - (landingTrackLinesLenghtY * 1.5); // start positioning the lines within the beginning of the track
var landingTrackLinesGeometry = new THREE.BoxGeometry(1.0, landingTrackLinesLenghtY, 0.2);
var landingTrackLinesMaterial = new THREE.MeshLambertMaterial({color:"rgb(255, 255, 255)"}); // white
// create the landing track
var landingTrackLines = new THREE.Mesh(landingTrackLinesGeometry, landingTrackLinesMaterial);
for(let i = 0; i < 8; i++){ // sets the number of lines on track
    let distance = 30.0; // distance between lines
    var landingTrackLines = new THREE.Mesh(landingTrackLinesGeometry, landingTrackLinesMaterial);
    vetLandingLines[i] = landingTrackLines; // add the newly created object to the array
    vetLandingLines[i].position.set(0.0, linesPosition-(i*distance), 0.02);
    landingTrack.add(vetLandingLines[i]); // add the newly created object to the scene
}
//-----------------------------------//
// LANDING TRACK CONFIGURATION END   //
//-----------------------------------//

//-----------------------------------//
// FLIGHT PATH CONFIGURATION BEGIN   //
//-----------------------------------//
// Path points configuration
var vetPathPoints = [];
vetPathPoints[0] = new THREE.Vector3( 0, -325, 20 ); // saida da pista
vetPathPoints[1] = new THREE.Vector3( 50, -200, 25 ); // perto da montanha alta
vetPathPoints[2] = new THREE.Vector3( 200, -100, 30 ); // perto da montanha media
vetPathPoints[3] = new THREE.Vector3( 300, 50, 20 ); // colado na montanha media
vetPathPoints[4] = new THREE.Vector3( 50, 150, 30 ); // atras da montanha alta
vetPathPoints[5] = new THREE.Vector3( -40, 80, 40 ); // inicio da subida da montanha alta
vetPathPoints[6] = new THREE.Vector3( -60, 20, 60 ); // continuacao da subida da montanha
vetPathPoints[7] = new THREE.Vector3( -50, -50, 70 ); // alto-frente da montanha alta
vetPathPoints[8] = new THREE.Vector3( 50, -150, 65 ); // inicio da descida
vetPathPoints[9] = new THREE.Vector3( 200, -350, 30 ); // inicio da floresta
vetPathPoints[10] = new THREE.Vector3( 150, -450, 30 ); // continuacao da floresta
vetPathPoints[11] = new THREE.Vector3( -150, -450, 40 ); // continuacao da floresta
vetPathPoints[12] = new THREE.Vector3( -150, -250, 20 ); // continuacao da floresta

//Create the path
var path = new THREE.CatmullRomCurve3( [
	//new THREE.Vector3( 0, -350, 20 ),
    vetPathPoints[0],
    vetPathPoints[1],
    vetPathPoints[2],
    vetPathPoints[3],
    vetPathPoints[4],
    vetPathPoints[5],
    vetPathPoints[6],
    vetPathPoints[7],
    vetPathPoints[8],
    vetPathPoints[9],
    vetPathPoints[10],
    vetPathPoints[11],
    vetPathPoints[12]
]
);

var pathPoints = path.getPoints( 500 ); // 500 is the number of curve points
var pathGeometry = new THREE.BufferGeometry().setFromPoints( pathPoints );
var pathMaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } ); // red
// Create the final path object and add it to the scene
var pathObject = new THREE.Line( pathGeometry, pathMaterial );
//scene.add(pathObject);
groundPlane.add(pathObject);

// Vars to save the objects for later usage
var vetCheckPoints = [];
var vetCheckPointsPositions = [];
var vetCheckPointsColors = []
var checkPointAtual = 0;
var checkPointRadius = 10.0;

var checkPointMaterialGrey = new THREE.MeshPhongMaterial({color:"lightgrey", transparent:"true", opacity:"0.7"}); 
var checkPointMaterialOrange = new THREE.MeshPhongMaterial({color:"orange", transparent:"true", opacity:"0.7"}); 


//Checkpoint colors
for(let i=0;i<vetPathPoints.length;i++){
    vetCheckPointsColors[i] = checkPointMaterialGrey;
}
vetCheckPointsColors[0] = checkPointMaterialOrange;

// Configure and create one check point object
function generateOneCheckPoint(index){ // auxiliary function
    var checkPointGeometry = new THREE.TorusGeometry(checkPointRadius, 0.5, 32, 24);
    
    var checkPoint = new THREE.Mesh(checkPointGeometry, vetCheckPointsColors[index]);
    //checkPoint.rotateX(degreesToRadians(90));

    return checkPoint;
}
// Instantiate the check points on screen
function createCheckPoints(){
    for (let i = 0; i < vetPathPoints.length; i++) {
        vetCheckPoints[i] = generateOneCheckPoint(i);
        vetCheckPoints[i].position.copy(vetPathPoints[i]);
        vetCheckPointsPositions[i] = vetPathPoints[i];
        vetCheckPoints[i].visible = false; // Check points start hidden, they will be shown later
        
        //scene.add(vetCheckPoints[i]);
        //let pos = vetPathPoints[i];
        if(i == 0 || i == 3 || i == (vetPathPoints.length - 1)){ // the three checkpoints that have fixed angles
            vetCheckPoints[i].rotateX(degreesToRadians(90));
        } else {
            vetCheckPoints[i].lookAt(vetPathPoints[i+1]);
        }
        //vetCheckPoints[i].lookAt(vetPathPoints[i-1]);
        groundPlane.add(vetCheckPoints[i]);
    }
    vetCheckPoints[0].visible = true; // Displays the first check point
}
createCheckPoints();
//-----------------------------------//
// FLIGHT PATH CONFIGURATION END     //
//-----------------------------------//

function keyboardUpdate() {
    //keyboard.update(); // desabilitado porque a funcao keyboardUpdateHolder ja realiza o update // verifica qual tecla esta sendo pressionada
    if (keyboard.down("G")){ // Toggles the directional light helper
        directionalLightHelper.visible = !directionalLightHelper.visible;
    }
    if (keyboard.down("F")){ // Toggles the axes helper
        axesHelper.visible = !axesHelper.visible;
    }
    if (keyboard.down("enter")){ // Toggles the path visualization
        pathObject.visible = !pathObject.visible;
    }
    if (keyboard.down("space")){ // Toggles the inspection mode
        showInfoOnScreen(""); // hide the secondary text in inspection mode
    }
    if (keyboard.down("P")){ // Debug key
        //mesh1.visible = !mesh1.visible; // esconde a montanha menor
        //mesh3.visible = !mesh3.visible; // esconde a montanha media
        //mesh5.visible = !mesh5.visible; // esconde a montanha maior
    }
}
// Check if a integer number is in a given range
function isInRange(x, min, max) {
    min = Math.round(min);
    max = Math.round(max);
    x = Math.round(x);
    
    if (x >= min && x <= max) {
        return true;
    } else {
        return false;
    }
}

// Function to clear the flight school path
function clearPath(){
    for (let i = 0; i < vetCheckPoints.length; i++) {
        groundPlane.remove(vetCheckPoints[i]); // Removes every remnant check point
    }
    vetCheckPointsPositions.length = 0; // Cleaning the array completely
    groundPlane.remove(pathObject); // Disposes the path helper
}
var cont = 0; // keeps track of what is the next checkpoint

function pathUpdate(i){
    if (i < vetCheckPoints.length - 2) { // the last two check points will be removed without updating any other check point objects
        groundPlane.remove(vetCheckPoints[i]); // removes the reached check point from scene
        vetCheckPoints[i+1].visible = true;
        vetCheckPoints[i+2].visible = true;
        cont++; // Updates which is the next check point
    } else {
        groundPlane.remove(vetCheckPoints[i]); // removes the last check point before the final one
        cont++;
    }
    
}
var timeStart, timeFinish; // Save time data to use later
// Function to return a total event time in seconds
function calcLapTime(start, finish){
    let begin = start.getTime() / 1000; // display in seconds, not in miliseconds
    let end = finish.getTime() / 1000; // display in seconds, not in miliseconds
    
    let result = end - begin; // calculate the result

    return Math.floor(result);
}

// Checks if a checkpoint was reached
function checkHit(){

    if (
        isInRange(aviao.getPosicao()[0], vetCheckPointsPositions[checkPointAtual].getComponent(0) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(0) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[1], vetCheckPointsPositions[checkPointAtual].getComponent(1) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(1) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[2], vetCheckPointsPositions[checkPointAtual].getComponent(2) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(2) + checkPointRadius)
        ){
            if(checkPointAtual==0){
                //console.log("START!");
                pathUpdate(cont);
                timeStart = new Date(); // starts counting the time
                showInfoOnScreen("Lap started! Good luck!");
            } else if(checkPointAtual==(vetCheckPoints.length-1)){
                //console.log("END!");
                clearPath();
                timeFinish = new Date(); // ends counting the time
                showInfoOnScreen('Congratulations! Your lap took ' + calcLapTime(timeStart, timeFinish) + ' seconds...');

            } else {
                //console.log("hit!");
                let completion = Math.floor(((cont + 1) / vetCheckPoints.length) * 100);
                showInfoOnScreen("Task completion: " + (cont + 1) + " / " + vetCheckPoints.length + " checkpoints (" + completion + "%)");
                pathUpdate(cont);
            }
            checkPointAtual++;
            vetCheckPoints[checkPointAtual].material =checkPointMaterialOrange;
            //vetCheckPointsColors[checkPointAtual+1] = checkPointMaterialOrange;
        }

    /*
    for (let i = 0; i < vetCheckPointsPositions.length; i++) {
        if (
        isInRange(aviao.getPosicao()[0], vetCheckPointsPositions[i].getComponent(0) - checkPointRadius, vetCheckPointsPositions[i].getComponent(0) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[1], vetCheckPointsPositions[i].getComponent(1) - checkPointRadius, vetCheckPointsPositions[i].getComponent(1) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[2], vetCheckPointsPositions[i].getComponent(2) - checkPointRadius, vetCheckPointsPositions[i].getComponent(2) + checkPointRadius)
        ) {
            if (cont == 0) { // checks if it's the first check point
                //console.log("START!");
                pathUpdate(cont);
                timeStart = new Date(); // starts counting the time
                showInfoOnScreen("Lap started! Good luck!");
            } else if (cont > 0 && cont < (vetCheckPoints.length - 1)) { // the other check points
                //console.log("hit!");
                let completion = Math.floor(((cont + 1) / vetCheckPoints.length) * 100);
                showInfoOnScreen("Task completion: " + (cont + 1) + " / " + vetCheckPoints.length + " checkpoints (" + completion + "%)");
                pathUpdate(cont);
            } else if (cont == (vetCheckPoints.length - 1)) { // checks if it's the last check point
                //console.log("END!");
                clearPath();
                timeFinish = new Date(); // ends counting the time
                showInfoOnScreen('Congratulations! Your lap took ' + calcLapTime(timeStart, timeFinish) + ' seconds...');
            }
            //scene.remove(vetCheckPoints[i]); // removes the reached check point from scene
            //vetCheckPoints.shift();
            vetCheckPointsPositions.shift(); // Disable the reached position
        }
    }
    */
}

// Show text information onscreen
showInformation(); // displays information about the controls
showInfoOnScreen("TIP: Follow the red path"); // displays the initial secondary message
gerarArvores(groundPlane); // coloca as arvores em cima do plano

// Function to update the secondary infobox
function showInfoOnScreen(text){
    information.changeMessage(text);
}

function showInformation()
{
  // Use this to show information onscreen
    var controls = new InfoBox();
    controls.add("Flight Simulator controls:");
    controls.addParagraph();
    controls.add("Press arrow keys to change airplane direction");
    controls.add("Press Q to move faster");
    controls.add("Press A to move slower");
    controls.add("Press C to toggle cockpit camera");
    controls.add("Press F to toggle the axes helper");
    controls.add("Press G to toggle the sunlight helper");
    //controls.add("Press H to toggle this help box");
    controls.add("Press ENTER to toggle the path helper");
    controls.add("Press SPACE to toggle inspection mode");
    controls.show();
}

var aviao = new Aviao(scene);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraNormal(), renderer)}, false ); // no modo simulacao
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraInspecao(), renderer)}, false ); // no modo inspecao
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraCockpit(), renderer)}, false ); // no modo inspecao


var trackballControls = new TrackballControls( aviao.getCameraInspecao(), renderer.domElement );
function render() {
    requestAnimationFrame( render );
	renderer.render( scene, aviao.getCameraAtual() );
    stats.update(); // Update FPS
    aviao.keyboardUpdateHolder(groundPlane); // listens to keyboard inputs and controls cameraHolder
    aviao.moverAviao(); // moves the airplane foward
    trackballControls.update(); // Enable mouse movements
    aviao.rotateBlades(); // Enable airplane blades rotation
    aviao.slowSpeed(); // Checks if airplane is too slow
    keyboardUpdate(); // listens to keyboard inputs and controls some objects
    checkHit(); // Checks if the airplane hit some check point
}
render();
