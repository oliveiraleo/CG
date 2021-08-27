import * as THREE from  '../build/three.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import Stats from               '../build/jsm/libs/stats.module.js';
import KeyboardState from       '../libs/util/KeyboardState.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js'
import {initRenderer, 
        onWindowResize, 
        degreesToRadians,
        //initCamera,
        //BufferGeometry,
        //ConvexGeometry,
        SecondaryBox,
        InfoBox,
        lightFollowingCamera,
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
// Spot light
var spotLight = new THREE.SpotLight( "white", 0.0); // 0.0 because it starts turned off
scene.add(spotLight);
spotLight.position.set(0, 0, 10); // sets the initial position of the spotlight
// Hemisphere light
var hemisphereLight = new THREE.HemisphereLight( "white", "white", 0.75 );
scene.add( hemisphereLight );
// White directional light shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75 );
// Directional light configs
// shadow resolution
directionalLight.shadow.mapSize.width = 2048; // was 8192
directionalLight.shadow.mapSize.height = 2048; // was 8192
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
// var mountainScaleMedium = 5;
// var mountainScaleHigh = 10;
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
/*var points3 = [// cume
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
];*/
    
var geometry1 = new ConvexGeometry( points1 );
var geometry2 = new ConvexGeometry( points2 );

// var geometry3 = new ConvexGeometry( points3 );
// var geometry4 = new ConvexGeometry( points4 );

// var geometry5 = new ConvexGeometry( points5 );
// var geometry6 = new ConvexGeometry( points6 );
// mountain materials
var materialLand = new THREE.MeshLambertMaterial( { color:"rgb(80, 75, 0)" } ); // brown
//var materialRock = new THREE.MeshLambertMaterial( { color:"rgb(120, 140, 130)" } ); // grey
//var materialAsteroid = new THREE.MeshLambertMaterial( { color:"rgb(60, 80, 80)" } ); // deep grey
//var materialBrick = new THREE.MeshLambertMaterial( { color:"rgb(210, 170, 60)" } ); // brick orange
// Small mountain
var mesh1 = new THREE.Mesh( geometry1, materialLand );
var mesh2 = new THREE.Mesh( geometry2, materialLand );
//mesh1.position.set(-350,300,0);
//groundPlane.add( mesh1 );
mesh1.add( mesh2 );

// create the mountain ground plane
var mountainPlaneGeometry = new THREE.PlaneGeometry(100, 100);
//mountainPlaneGeometry.translate(0.0, 0.0, -0.01); // To avoid conflict with the axeshelper
var mountainPlaneMaterial = new THREE.MeshLambertMaterial({
    //color: "rgba(150, 150, 150)", // light grey
    color: "rgb(80, 75, 0)", // brown
});
var mountainPlane = new THREE.Mesh(mountainPlaneGeometry, mountainPlaneMaterial);
// add the ground plane to the scene
mountainPlane.receiveShadow = true; // enables shadows
mountainPlane.position.set(-350,300,0);
//mountainPlane.position.set(0,-300,0);
groundPlane.add(mountainPlane);
mountainPlane.add(mesh1);

// Medium mountain
/*var mesh3 = new THREE.Mesh( geometry3, materialBrick );
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
mesh6.add( mesh7 );*/

// mountains shadows
mesh1.receiveShadow = true;
mesh2.receiveShadow = true;
/*mesh3.receiveShadow = true;
mesh4.receiveShadow = true;
mesh5.receiveShadow = true;
mesh6.receiveShadow = true;
mesh7.receiveShadow = true;*/

mesh1.castShadow = true;
mesh2.castShadow = true;
/*mesh3.castShadow = true;
mesh4.castShadow = true;
mesh5.castShadow = true;
mesh6.castShadow = true;
mesh7.castShadow = true;*/
//-----------------------------------//
// MOUNTAINS CONFIGURATION END       //
//-----------------------------------//

//-----------------------------------//
// CITY CONFIGURATION BEGIN          //
//-----------------------------------//
// create the city ground plane
var cityPlaneGeometry = new THREE.PlaneGeometry(400, 400);
var cityPlaneMaterial = new THREE.MeshLambertMaterial({
    //color: "rgba(150, 150, 150)", // light grey
    color: "white" // TODO change the color
    //TODO apply texture?
});
var cityPlane = new THREE.Mesh(cityPlaneGeometry, cityPlaneMaterial);
// add the ground plane to the scene
cityPlane.receiveShadow = true; // enables shadows
cityPlane.position.set(0.0, 0.0, 0.02);
groundPlane.add(cityPlane);
//cityPlane.add(mesh1);
//-----------------------------------//
// CITY CONFIGURATION END            //
//-----------------------------------//

//-----------------------------------//
// STREETS CONFIGURATION BEGIN       //
//-----------------------------------//
// Landing track (pista de pouso)
var streetLenghtX = 20.0; // largura
var streetLenghtY = 120.0; // comprimento
var mainStreet = [];

var streetGeometry = new THREE.BoxGeometry(streetLenghtX, streetLenghtY, 0.01);
var streetMaterial = new THREE.MeshLambertMaterial({color:"rgb(60, 60, 60)"}); // light grey
// create streets
/*var street = new THREE.Mesh(streetGeometry, streetMaterial);
street.position.set(0.0, -50.0, 0.0);
street.receiveShadow = true;
groundPlane.add(street);*/

// create the main street
for (let i = 0; i < 4; i++) {
    mainStreet[i] = new THREE.Mesh(streetGeometry, streetMaterial);
    if (i%2 == 0) {
        mainStreet[i].rotateZ(degreesToRadians(90));
    }
    //mainStreet[i].rotateZ(degreesToRadians(90)*i);
    mainStreet[i].receiveShadow = true;
    cityPlane.add(mainStreet[i]);
}
mainStreet[0].position.set(0.0, 50.0, 0.02);
mainStreet[1].position.set(50.0, 0.0, 0.02);
mainStreet[2].position.set(0.0, -50.0, 0.02);
mainStreet[3].position.set(-50.0, 0.0, 0.02);

// create the main square ground plane
var mainSquarePlaneGeometry = new THREE.PlaneGeometry(81, 81);
var mainSquarePlaneMaterial = new THREE.MeshLambertMaterial({
    //color: "rgba(150, 150, 150)", // light grey
    color: "rgb(80, 80, 80)" // TODO change the color
});
var mainSquarePlane = new THREE.Mesh(mainSquarePlaneGeometry, mainSquarePlaneMaterial);
// add the ground plane to the scene
mainSquarePlane.receiveShadow = true; // enables shadows
mainSquarePlane.position.set(0.0, 0.0, 0.02);
cityPlane.add(mainSquarePlane);

//-----------------------------------//
// STREETS CONFIGURATION END         //
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

    return checkPoint;
}
// Instantiate the check points on screen
function createCheckPoints(){
    for (let i = 0; i < vetPathPoints.length; i++) {
        vetCheckPoints[i] = generateOneCheckPoint(i);
        vetCheckPoints[i].position.copy(vetPathPoints[i]);
        vetCheckPointsPositions[i] = vetPathPoints[i];
        vetCheckPoints[i].visible = false; // check points start hidden, they will be shown later
        
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

//var controlsHelperBoxState = true;
// Controls info boxes visibility
function togglesInfoBoxVisibility(boxId){
    if (document.getElementById(boxId).style.display == "") { // if infobox is visible, hide it
        document.getElementById(boxId).style.display = "none"; // hides the infobox
    } else {
        document.getElementById(boxId).style.display = ""; // if not, show it again
    }
}

// Function to control which light will be used on each scene
function togglesSceneLights(){
    // directional light used when on simulator mode
    if (directionalLight.intensity != 0.0) { // if light is on
        directionalLight.intensity = 0.0; // turns it off
    } else {
        directionalLight.intensity = 0.75; // or turns it back on
    }
    
    // hemisphere light used when on simulator mode
    if (hemisphereLight.intensity != 0.0) { // if light is on
        hemisphereLight.intensity = 0.0; // turns it off
    } else {
        hemisphereLight.intensity = 0.75; // or turns it back on
    }

    // spot light used inside the inspection mode
    if (spotLight.intensity != 0.0) { // if light is on
        spotLight.intensity = 0.0; // turns it off
    } else {
        spotLight.intensity = 1.5; // or turns it back on
    }
}

function keyboardUpdate() {
    //keyboard.update(); // desabilitado porque a funcao keyboardUpdateHolder ja realiza o update // verifica qual tecla esta sendo pressionada
    if (keyboard.down("G")){ // Toggles the directional light helper
        directionalLightHelper.visible = !directionalLightHelper.visible;
    }
    if (keyboard.down("F")){ // Toggles the axes helper
        axesHelper.visible = !axesHelper.visible;
    }
    if (keyboard.down("H")){ // Toggles the info box controls text helper
        togglesInfoBoxVisibility("InfoxBox");
    }
    if (keyboard.down("enter")){ // Toggles the path visualization
        pathObject.visible = !pathObject.visible;
    }
    if (keyboard.down("space")){ // Toggles the inspection mode
        //showInfoOnScreen(""); // hide the secondary text in inspection mode
        togglesInfoBoxVisibility("box");
        // TODO hide controls on inspection mode ?
        togglesSceneLights();
    }
    if (keyboard.down("M")){ // TODO
        // TODO
        //music.pause();
    }
    if (keyboard.down("P")){ // Debug key
        //mesh1.visible = !mesh1.visible; // esconde a montanha menor
        //mesh3.visible = !mesh3.visible; // esconde a montanha media
        //mesh5.visible = !mesh5.visible; // esconde a montanha maior
        //document.getElementById("InfoxBox").style.display = "none";
        //music.play();
        if (music.getVolume() != 0.0) {
            music.setVolume(0.0);
        } else {
            music.setVolume(0.15);
        }
    }
    if (keyboard.down("O")){ // Another Debug key
        //document.getElementById("InfoxBox").style.display = "";
        //checkpointSound.play();
        //levelSound.play();
        //levelSound.onEnded(pilotFinalMesssage.play());

        //pilotFinalMesssage.play();
        //pilotFinalMesssage.onEnded(levelSound.play());

        mainSquarePlane.visible = !mainSquarePlane.visible;
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
var cont = 0; // keeps track of which one is the next checkpoint
var isPathEnded = false; // verifies if the path is over

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
    vetCheckPoints[i+1].material = checkPointMaterialOrange; // udates the next check point color
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
        !isPathEnded &&
        isInRange(aviao.getPosicao()[0], vetCheckPointsPositions[checkPointAtual].getComponent(0) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(0) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[1], vetCheckPointsPositions[checkPointAtual].getComponent(1) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(1) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[2], vetCheckPointsPositions[checkPointAtual].getComponent(2) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(2) + checkPointRadius)
        ){
            if(checkPointAtual == 0){ // first
                pathUpdate(cont);
                timeStart = new Date(); // starts counting the time
                showInfoOnScreen("Lap started! Good luck!");
                //vetCheckPoints[checkPointAtual+1].material = checkPointMaterialOrange;
                checkpointSound.play();
                pilotStartMesssage.play();
            } else if(checkPointAtual == (vetCheckPoints.length-1)){ // last
                isPathEnded = true; // now the path is finished
                clearPath();
                timeFinish = new Date(); // ends counting the time
                showInfoOnScreen('Congratulations! Your lap took ' + calcLapTime(timeStart, timeFinish) + ' seconds...');
                levelSound.play();
                //levelSound.onEnded(pilotFinalMesssage.play());
            } else {
                if (checkPointAtual == (vetCheckPoints.length-2)) { // plays the final radio message
                    pilotFinalMesssage.play();
                }
                vetCheckPoints[checkPointAtual].material = checkPointMaterialOrange;
                let completion = Math.floor(((cont + 1) / vetCheckPoints.length) * 100);
                showInfoOnScreen("Task completion: " + (cont + 1) + " / " + vetCheckPoints.length + " checkpoints (" + completion + "%)");
                checkpointSound.play();
                pathUpdate(cont);
            }
            checkPointAtual++;
            //vetCheckPoints[checkPointAtual].material = checkPointMaterialOrange;
        }
}

//-----------------------------------//
// EXTERNAL OBJECTS CONFIG BEGIN     //
//-----------------------------------//
// External reference URL: https://threejsfundamentals.org/threejs/lessons/threejs-load-obj.html
var scale = 1.0; // adjust external objects scale
// Humvee

// instantiate a object loader
const humveeLoader = new OBJLoader();
// instantiate a texture loader
const humveeMtlLoader = new MTLLoader();
humveeMtlLoader.load('models/cars/army/Humvee.mtl', (mtl) => {
    mtl.preload();
  humveeLoader.setMaterials(mtl);

// load a resource
humveeLoader.load(
	// resource URL
	'models/cars/army/Humvee.obj',
	// called when resource is loaded
	function ( car ) {
        car.position.set(0, 20, 0);
        car.rotateX(degreesToRadians(90));
        // object scale
        car.scale.set(  0.04 * scale,
                        0.04 * scale,
                        0.04 * scale);
		landingTrack.add( car );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( 'Humvee ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Humvee loading error' );

	}
)
});

// Police car

// instantiate a object loader
const policeCarLoader = new OBJLoader();
// instantiate a texture loader
const policeCarMtlLoader = new MTLLoader();
policeCarMtlLoader.load('models/cars/city/police-car.mtl', (mtl2) => {
  mtl2.preload();
  policeCarLoader.setMaterials(mtl2);

// load a resource
policeCarLoader.load(
	// resource URL
	'models/cars/city/police-car.obj',
	// called when resource is loaded
	function ( car ) {
        //car.position.set(0, 0, 0);
        car.rotateX(degreesToRadians(90));
        //let sc = new THREE.Vector3(1.0, 1.0, 1.0);
        // object scale
        car.scale.set(  3.0 * scale,
                        3.0 * scale,
                        3.0 * scale);
		landingTrack.add( car );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( 'Police car ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Police car loading error' );

	}
)
});

// Racing car

// instantiate a object loader
const racingCarLoader = new OBJLoader();
// instantiate a texture loader
const racingCarMtlLoader = new MTLLoader();
racingCarMtlLoader.load('models/cars/city/racing-car.mtl', (mtl3) => {
  mtl3.preload();
  racingCarLoader.setMaterials(mtl3);

// load a resource
racingCarLoader.load(
	// resource URL
	'models/cars/city/racing-car.obj',
	// called when resource is loaded
	function ( car ) {
        car.position.set(0, -20, 0);
        car.rotateX(degreesToRadians(90));
        //let sc = new THREE.Vector3(1.0, 1.0, 1.0);
        // object scale
        car.scale.set(  3.0 * scale,
                        3.0 * scale,
                        3.0 * scale);
		landingTrack.add( car );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( 'Racing car ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Racing car loading error' );

	}
)
});

// Owl statue

// instantiate a object loader
const statueLoader = new OBJLoader();
// instantiate a texture loader
const statueMtlLoader = new MTLLoader();
statueMtlLoader.load('models/architecture/owl-top-hat.mtl', (mtl4) => {
  mtl4.preload();
  statueLoader.setMaterials(mtl4);

// load a resource
statueLoader.load(
	// resource URL
	'models/architecture/owl-top-hat.obj',
	// called when resource is loaded
	function ( statue ) {
        //statue.position.set(20, 0, 0);
        statue.rotateX(degreesToRadians(90));
        // object scale
        statue.scale.set(  0.5 * scale,
                        0.5 * scale,
                        0.5 * scale);
		mainSquarePlane.add( statue );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( 'Statue ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Statue loading error' );

	}
)
});
//-----------------------------------//
// EXTERNAL OBJECTS CONFIG END       //
//-----------------------------------//

//-----------------------------------//
// TEXTURES CONFIGURATION BEGIN      //
//-----------------------------------//
// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader(); // Creates the loader
var asphault = textureLoader.load('./textures/asphault-512_256.jpg');
var grass = textureLoader.load('./textures/grass-1024.jpg');
var terrain = textureLoader.load('./textures/terrain-1024.jpg');

// Asphault texture configuration
asphault.wrapS = THREE.RepeatWrapping;
asphault.wrapT = THREE.RepeatWrapping;
asphault.repeat.set( 1, 8 );
asphault.magFilter = THREE.LinearFilter;

// Grass texture configuration
grass.wrapS = THREE.RepeatWrapping;
grass.wrapT = THREE.RepeatWrapping;
grass.repeat.set( 50, 50 );
grass.magFilter = THREE.LinearFilter;

// Terrain land texture configuration
terrain.wrapS = THREE.RepeatWrapping;
terrain.wrapT = THREE.RepeatWrapping;
terrain.repeat.set( 8, 8 );
terrain.magFilter = THREE.LinearFilter;

// Apply texture to the 'map' property of the respective materials' objects
landingTrack.material.map = asphault; // apply asphault on landing track
mainStreet[0].material.map = asphault; // apply asphault on main street
groundPlane.material.map = grass; // apply grass on ground plane
mountainPlane.material.map = terrain; // apply land texture on terrain near mountain
mesh1.material.map = terrain; // apply land texture on mountain TODO verify that later

//-----------------------------------//
// TEXTURES CONFIGURATION END        //
//-----------------------------------//

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
    //controls.addParagraph();
    controls.add("Press arrow keys to change airplane direction");
    controls.add("Press Q to move faster");
    controls.add("Press A to move slower");
    controls.addParagraph();
    controls.add("Camera modes:");
    controls.add("Press C to toggle cockpit camera");
    controls.add("Press SPACE to toggle inspection mode");
    controls.addParagraph();
    controls.add("Ambient controls:");
    controls.add("Press ENTER to toggle the path helper");
    controls.add("Press F to toggle the axes helper");
    controls.add("Press G to toggle the sunlight helper");
    controls.add("Press H to toggle this help box");
    controls.addParagraph();
    controls.add("Music controls:");
    controls.add("Press P to play / pause the sound track");
    //controls.add("Press M to mute the sound track");
    controls.show();
}

var aviao = new Aviao(scene);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraNormal(), renderer)}, false ); // no modo simulacao
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraInspecao(), renderer)}, false ); // no modo inspecao
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraCockpit(), renderer)}, false ); // no modo inspecao

//-----------------------------------//
// AUDIO CONFIGURATION BEGIN         //
//-----------------------------------//
// Create a listener and add it to que camera
//var firstPlay = true;
var listener = new THREE.AudioListener();
  //camera.add( listener );
  aviao.getCameraNormal().add( listener );

// create the global audio sources
const music = new THREE.Audio( listener );  
const checkpointSound = new THREE.Audio( listener );  
const levelSound = new THREE.Audio( listener );  
const pilotStartMesssage = new THREE.Audio( listener );  
const pilotFinalMesssage = new THREE.Audio( listener );  

// Create ambient sound
var audioLoader = new THREE.AudioLoader();
audioLoader.load( './sounds/CS-GO-Lock&Load.ogg', function( buffer ) {
	music.setBuffer( buffer );
	music.setLoop( true );
	music.setVolume( 0.15 );
	music.play();
});

// Create check point check sound
var audioLoaderCheckPoint = new THREE.AudioLoader();
audioLoaderCheckPoint.load( './sounds/check-point.ogg', function( buffer ) {
	checkpointSound.setBuffer( buffer );
	//music.setLoop( true );
	checkpointSound.setVolume( 1.00 );
	//music.play(); // Will play when a check point is reached
});

// Create last check point check sound
audioLoader.load( './sounds/level-clear.ogg', function ( buffer ) {
    levelSound.setBuffer( buffer );
    //checkpointSound.setLoop( true );
    levelSound.setVolume( 0.75 );
    //checkpointSound.play(); // Will play when the last check point is reached
} );

// Create start pilot radio message
audioLoader.load( './sounds/pilot-fasten-seatbelts.ogg', function ( buffer ) {
    pilotStartMesssage.setBuffer( buffer );
    //checkpointSound.setLoop( true );
    pilotStartMesssage.setVolume( 1.00 );
    //checkpointSound.play(); // Will play when the first check point is reached
} );

// Create final pilot radio message
audioLoader.load( './sounds/pilot-have-a-nice-day.ogg', function ( buffer ) {
    pilotFinalMesssage.setBuffer( buffer );
    //checkpointSound.setLoop( true );
    pilotFinalMesssage.setVolume( 1.00 );
    //checkpointSound.play(); // Will play when the last check point is reached
} );

//-----------------------------------//
// AUDIO CONFIGURATION END           //
//-----------------------------------//

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
    aviao.setEngineSound();
    keyboardUpdate(); // listens to keyboard inputs and controls some objects
    checkHit(); // Checks if the airplane hit some check point
    lightFollowingCamera(spotLight, aviao.getCameraInspecao()); // enables the light inside inspection mode to follow the camera
}
render();
