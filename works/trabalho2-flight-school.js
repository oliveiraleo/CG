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
        InfoBox} from "../libs/util/util.js";

import { gerarArvores } from './classes/arvore.js';
import {Aviao} from './classes/aviao.js';

var stats = new Stats();        // To show FPS information
var scene = new THREE.Scene();  // create scene
var renderer = initRenderer();  // View function in util/utils
//initDefaultBasicLight(scene, 1, new THREE.Vector3(0, 0, 25)); // Adds some light to the scene
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
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
//directionalLight.penunbra = 0.7; TODO config this
// area where shadows appear // 500 x 500 = size of gound plane
directionalLight.shadow.camera.left = -500;
directionalLight.shadow.camera.right = 500;
directionalLight.shadow.camera.top = 500;
directionalLight.shadow.camera.bottom = -500;
// near and far // TODO configure that later
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default
// enable shadows
directionalLight.castShadow = true;
// directional light position
directionalLight.position.set(0, 0, 100); // TODO adjust scene lights // TODO create a fake sunlight in the same position to mimic the sun
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

//-----------------------------------//
// MOUNTAINS CONFIGURATION BEGIN     //
//-----------------------------------//
var points1 = [// cume
              new THREE.Vector3( 0, 1.0, 6 ),
              new THREE.Vector3( 0, 2.0, 8.5 ),
              new THREE.Vector3( 0, 4.0, 8 ),
              new THREE.Vector3( 0, 6.0, 8 ),
              new THREE.Vector3( 0, 8.0, 4 ),
              new THREE.Vector3( 5, 5.0, 6 ),
              new THREE.Vector3( -4, 2.0, 3 ),
              // base
              new THREE.Vector3( 0, 0.0, 0 ),
              new THREE.Vector3( 0, 10.0, 0 ),
              new THREE.Vector3( 10, 10.0, 0 ),
              new THREE.Vector3( -5, 5.0, 0 ),
              new THREE.Vector3( 6, 2.0, 0 ),
              new THREE.Vector3( 5, 12.0, 0 ),
              new THREE.Vector3( 7, 5.0, 0 )
            ];

var points2 = [// cume
                new THREE.Vector3( 0, -1.0, 6 ),
                new THREE.Vector3( 0, -2.0, 10 ),
                new THREE.Vector3( 0, -4.0, 8 ),
                new THREE.Vector3( 0, -6.0, 8 ),
                new THREE.Vector3( 0, -8.0, 4 ),
                new THREE.Vector3( 5, -5.0, 6 ),
                new THREE.Vector3( -4, -2.0, 3 ),
                // base
                new THREE.Vector3( 0, 0.0, 0 ),
                new THREE.Vector3( 0, 10.0, 0 ),
                new THREE.Vector3( 10, 8.0, 0 ),
                new THREE.Vector3( -5, -5.0, 0 ),
                new THREE.Vector3( 6, 2.0, 0 ),
                new THREE.Vector3( 5, -12.0, 0 ),
                new THREE.Vector3( 7, 5.0, 0 )
            ];
var points3 = [// cume // TODO Fix the snow
                new THREE.Vector3( 0, -1.0, 6 ),
                new THREE.Vector3( 0, -2.0, 10 ),
                new THREE.Vector3( 0, -4.0, 8 ),
                new THREE.Vector3( 0, -6.0, 8 ),
                //new THREE.Vector3( 0, -8.0, 4 ),
                new THREE.Vector3( 5, -5.0, 6 ),
                //new THREE.Vector3( -4, -2.0, 3 ),
                // base
                /*new THREE.Vector3( 0, -1.75, 5 ),
                new THREE.Vector3( 0, -2.0, 9 ),
                new THREE.Vector3( 0, -4.0, 7 ),
                new THREE.Vector3( 0, -6.0, 7 ),
                new THREE.Vector3( 0, -8.0, 3 ),
                //new THREE.Vector3( 5, -5.0, 5 ),
                new THREE.Vector3( -4, -2.0, 2 )*/
                /*new THREE.Vector3( 0, 0.0, 0 ),
                new THREE.Vector3( 0, 10.0, 0 ),
                new THREE.Vector3( 10, 10.0, 0 ),
                new THREE.Vector3( -5, -5.0, 0 ),
                new THREE.Vector3( 6, 2.0, 0 ),
                new THREE.Vector3( 5, -12.0, 0 ),
                new THREE.Vector3( 7, 5.0, 0 )];*/
                ];
//var points = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
var geometry1 = new ConvexGeometry( points1 );
var geometry2 = new ConvexGeometry( points2 );
var geometry3 = new ConvexGeometry( points3 );
//var geometry = new THREE.ConvexBufferGeometry(points);
//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var materialRock = new THREE.MeshLambertMaterial( { color:"rgb(80, 75, 0)" } ); // brown
var materialIce = new THREE.MeshLambertMaterial( { color:"rgb(150, 150, 180)" } ); // light grey
var mesh1 = new THREE.Mesh( geometry1, materialRock );
var mesh2 = new THREE.Mesh( geometry2, materialRock );
var mesh3 = new THREE.Mesh( geometry3, materialIce );
mesh1.position.set(0,-350,0);
//mesh2.position.set(20,-300,0);
scene.add( mesh1 );
mesh1.add( mesh2 );
mesh2.add( mesh3 );
//scene.add( mesh2 );
//-----------------------------------//
// MOUNTAINS CONFIGURATION END       //
//-----------------------------------//

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
// Reposition of helper to better visualization of it
axesHelper.translateY(20); // TODO remove translation from axes helper
axesHelper.translateX(20);

// Plano base que simula agua
/*var groundPlaneWired = createGroundPlaneWired(1000, 1000, 20, 20, "green");
groundPlaneWired.rotateX(degreesToRadians(90)); // rotacionado por conta da pespectiva da camera "arrasto no chao"
// Adiciona ambos objetos na cena
scene.add(groundPlaneWired);
groundPlaneWired.add(axesHelper);*/

// create the ground plane
var groundPlaneGeometry = new THREE.PlaneGeometry(1000, 1000);
groundPlaneGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var groundPlaneMaterial = new THREE.MeshLambertMaterial({ // TODO change the material to mimic grass and for better visualization when moving the airplane
    //color: "rgba(150, 150, 150)", // light grey
    color: "green", // TODO adjust the color
    //side: THREE.DoubleSide,
    //receiveShadow: true,
});
var groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
// add the ground plane to the scene
groundPlane.receiveShadow = true; // enables shadows
scene.add(groundPlane);
groundPlane.add(axesHelper);

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
vetPathPoints[0] = new THREE.Vector3( 0, -350, 20 );
vetPathPoints[1] = new THREE.Vector3( 0, -250, 30 );
vetPathPoints[2] = new THREE.Vector3( 50, -50, 20 );
vetPathPoints[3] = new THREE.Vector3( 150, 50, 20 );
vetPathPoints[4] = new THREE.Vector3( 50, 150, 30 );
vetPathPoints[5] = new THREE.Vector3( 50, 250, 20 );
vetPathPoints[6] = new THREE.Vector3( 0, 350, 20 );
vetPathPoints[7] = new THREE.Vector3( 50, 450, 20 );
vetPathPoints[8] = new THREE.Vector3( 50, 460, 20 );
vetPathPoints[9] = new THREE.Vector3( 50, 500, 20 );

/*function getAllPathPoints(){
    for (let i = 0; i < vetPathPoints.length; i++) {
        return vetPathPoints[i];
    }
}*/

//Create the path
var path = new THREE.CatmullRomCurve3( [
	/*new THREE.Vector3( 0, -350, 20 ),
	new THREE.Vector3( -5, 5, 20 ),
	new THREE.Vector3( 0, 0, 20 ),
	new THREE.Vector3( 5, -5, 20 ),
	new THREE.Vector3( 10, 0, 20 )*/
    vetPathPoints[0],
    vetPathPoints[1],
    vetPathPoints[2],
    vetPathPoints[3],
    vetPathPoints[4],
    vetPathPoints[5],
    vetPathPoints[6],
    vetPathPoints[7],
    vetPathPoints[8],
    vetPathPoints[9]
]
);

var pathPoints = path.getPoints( 100 ); // TODO adjust later
var pathGeometry = new THREE.BufferGeometry().setFromPoints( pathPoints );
var pathMaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } ); // red
// Create the final path object and add it to the scene
var pathObject = new THREE.Line( pathGeometry, pathMaterial );
scene.add(pathObject);

// Vars to save the objects for later usage
var vetCheckPoints = [];
var vetCheckPointsPositions = [];
var checkPointRadius = 10.0;
// Configure and create one check point object
function generateOneCheckPoint(){ // auxiliary function
    var checkPointGeometry = new THREE.TorusGeometry(checkPointRadius, 0.5, 32, 24);
    var checkPointMaterial = new THREE.MeshPhongMaterial({color:"orange", transparent:"true", opacity:"0.7"}); 
    var checkPoint = new THREE.Mesh(checkPointGeometry, checkPointMaterial);
    checkPoint.rotateX(degreesToRadians(90));

    return checkPoint;
}
// Instantiate the check points on screen
function createCheckPoints(){
    for (let i = 0; i < vetPathPoints.length; i++) {
        vetCheckPoints[i] = generateOneCheckPoint();
        //vetCheckPoints[i].rotateX(degreesToRadians(90)); // TODO rotate according to the path
        //vetCheckPoints[i].position.set(1.0*i, 30.0+i, 20.0);
        vetCheckPoints[i].position.copy(vetPathPoints[i]);
        vetCheckPointsPositions[i] = vetPathPoints[i];
        vetCheckPoints[i].visible = false; // Check points start hidden, they will be shown later
        scene.add(vetCheckPoints[i]);
    }
    vetCheckPoints[0].visible = true; // Displays the first check point
}
createCheckPoints();
/*var checkPointGeometry = new THREE.TorusGeometry(10.0, 0.5, 32, 24);
var checkPointMaterial = new THREE.MeshPhongMaterial({color:"orange", transparent:"true", opacity:"0.75"}); 
var checkPoint = new THREE.Mesh(checkPointGeometry, checkPointMaterial);
checkPoint.rotateX(degreesToRadians(90)); // TODO rotate according to the path
//checkPoint.position.set(0.0, 30.0, 20.0);
//checkPoint.position.copy(pathPoint1);
checkPoint.position.copy(vetPathPoints[0]);*/
//landingTrack.add(checkPoint);
//scene.add(checkPoint);
//-----------------------------------//
// FLIGHT PATH CONFIGURATION END     //
//-----------------------------------//

//var checkPointPosition = new THREE.Vector3(); // creates a vector to get plane global position (x, y, z)
//checkPoint.getWorldPosition(checkPointPosition); // updates the position from the checkpoint
/*var checkPointX = checkPointPosition.getComponent(0);
var checkPointY = checkPointPosition.getComponent(1);
var checkPointZ = checkPointPosition.getComponent(2);*/
//console.log(checkPointX, checkPointY, checkPointZ);
//console.log(checkPointPositionX(), checkPointPositionY(), checkPointPositionZ());

/*function checkPointPositionX (){ // retorna a posicao X do checkpoint em relação a origem do plano
    checkPoint.getWorldPosition(checkPointPosition); // updates the position of the checkpoint
    let checkPointX = checkPointPosition.getComponent(0); // checkpoint coordinate X
    return checkPointX;
}
function checkPointPositionY (){ // retorna a posicao Y do checkpoint em relação a origem do plano
    checkPoint.getWorldPosition(checkPointPosition); // updates the position of the checkpoint
    let checkPointY = checkPointPosition.getComponent(1); // checkpoint coordinate Y
    return checkPointY;
}
function checkPointPositionZ (){ // retorna a altura do checkpoint em relação ao plano
    checkPoint.getWorldPosition(checkPointPosition); // updates the position of the checkpoint torus
    let checkPointZ = checkPointPosition.getComponent(2); // checkpoint coordinate Z
    return checkPointZ;
}*/

function keyboardUpdate() {
    //keyboard.update(); // desabilitado porque a funcao keyboardUpdateHolder ja realiza o update // verifica qual tecla esta sendo pressionada
    if (keyboard.down("G")){ // Toggles the directional light helper
        directionalLightHelper.visible = !directionalLightHelper.visible;
    }
    if (keyboard.down("H")){ // Toggles the axes helper
        axesHelper.visible = !axesHelper.visible;
    }
    if (keyboard.down("enter")){ // Toggles the path visualization
        pathObject.visible = !pathObject.visible;
    }
    if (keyboard.down("P")){ // Toggles the directional light helper
        //clearPath();
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
        scene.remove(vetCheckPoints[i]); // Removes every remnant check point
    }
    //vetCheckPoints.length = 0; // Cleaning the array completely
    vetCheckPointsPositions.length = 0; // Cleaning the array completely
    scene.remove(pathObject); // Disposes the path helper
}
var cont = 0; // keeps track of what is the next check point
function pathUpdate(i){
    if (i < vetCheckPoints.length - 2) { // the last two check points will be removed without updating any other check point objects
        scene.remove(vetCheckPoints[i]); // removes the reached check point from scene
        //vetCheckPoints[i].visible = false;
        vetCheckPoints[i+1].visible = true;
        vetCheckPoints[i+2].visible = true;
        cont++;
    } else {
        scene.remove(vetCheckPoints[i]); // removes the last check point before the final one
        //vetCheckPoints[i].visible = false;
        cont++;
    }
    
}
//var cont = displayedCheckPoints;
// Checks if a check point was reached
function checkHit(){
    for (let i = 0; i < vetCheckPointsPositions.length; i++) {
        if (
        isInRange(aviao.getPosicao()[0], vetCheckPointsPositions[i].getComponent(0) - checkPointRadius, vetCheckPointsPositions[i].getComponent(0) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[1], vetCheckPointsPositions[i].getComponent(1) - checkPointRadius, vetCheckPointsPositions[i].getComponent(1) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[2], vetCheckPointsPositions[i].getComponent(2) - checkPointRadius, vetCheckPointsPositions[i].getComponent(2) + checkPointRadius)
        ) {
            if (cont == 0) { // checks if it's the first check point
                console.log("START!");
                //vetCheckPoints[cont].visible = false;
                //vetCheckPoints[cont+1].visible = true;
                //displayedCheckPoints++;
                pathUpdate(cont);
                //cont++;
                //pathUpdate(cont);
                console.log(aviao.getPosicao());
                //TODO time the performance
            } else if (cont > 0 && cont < (vetCheckPoints.length - 1)) { // the other check points
                console.log("hit!");
                //displayedCheckPoints++;
                //vetCheckPoints[cont].visible = false;
                //vetCheckPoints[cont+1].visible = true;
                pathUpdate(cont);
                //cont++;
                //pathUpdate(cont);
            } else if (cont == (vetCheckPoints.length - 1)) { // checks if it's the last check point
                console.log("END!");
                clearPath();
            }
            //scene.remove(vetCheckPoints[i]); // removes the reached check point from scene
            //displayedCheckPoints++;
            //vetCheckPoints[i+displayedCheckPoints].visible = true;
            //pathUpdate(i);
            //vetCheckPoints.shift();
            vetCheckPointsPositions.shift();
        }
    }
}

// Show text information onscreen
showInformation(); // displays information about the controls

/*
var planePositionX = 0.0; // TODO fix airplane position restore from inspection mode
var planePositionY = -470.0; // previous value was -370.0
var planePositionZ = 2.5;

var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var mockPlaneGeometry = new THREE.BoxGeometry(100, 100, 100, 320);
var mockPlane = new THREE.Mesh(mockPlaneGeometry, fuselageMaterial);
mockPlane.position.set(0, -470, 0); // initial position
scene.add(mockPlane);
*/

gerarArvores(groundPlane);

function showInformation()
{
  // Use this to show information onscreen
    var controls = new InfoBox();
    controls.add("Flight Simulator controls:");
    controls.addParagraph();
    controls.add("Press arrow keys to change airplane direction");
    controls.add("Press Q to move faster");
    controls.add("Press A to move slower");
    controls.add("Press H to toggle the axes helper");
    controls.add("Press G to toggle the sunlight helper");
    controls.add("Press ENTER to toggle the path helper");
    controls.add("Press SPACE to toggle inspection mode");
    controls.show();
}

var aviao = new Aviao(scene);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraNormal(), renderer)}, false ); // no modo simulacao
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraInspecao(), renderer)}, false ); // no modo inspecao

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
    //getAirplaneHeightPosition(); // Updates the airplane position data
}
render();
