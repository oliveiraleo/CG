import * as THREE from  '../libs/other/three.module.r82.js';
import {RaytracingRenderer} from  '../libs/other/raytracingRenderer.js';
import {degreesToRadians} from "../libs/util/util.js";

var scene, renderer;

var container = document.createElement( 'div' );
document.body.appendChild( container );

var scene = new THREE.Scene();

// The canvas is in the XY plane.
// Hint: put the camera in the positive side of the Z axis and the
// objects in the negative side
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
//var camera = new THREE.PerspectiveCamera( 60, 2 / 1, 1, 1000 );
camera.position.z = 3.5;
camera.position.y = 1.5; // height is 3, so 3 / 2 = 1.5

// light
var intensity = 0.5;
var light = new THREE.PointLight( 0xffffff, intensity );
light.position.set( 0, 2.50, 0 );
scene.add( light );

var light = new THREE.PointLight( 0x55aaff, intensity );
light.position.set( -1.00, 1.50, 2.00 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, intensity );
light.position.set( 1.00, 1.50, 2.00 );
scene.add( light );

renderer = new RaytracingRenderer(window.innerWidth, window.innerHeight, 32, camera);
//renderer = new RaytracingRenderer(800, 400, 32, camera);
container.appendChild( renderer.domElement );

// materials
var phongMaterialBox = new THREE.MeshLambertMaterial( {
	//color: "rgb(255,255,255)",
  color: "rgb(180,180,180)", // grey
} );

var phongMaterialBoxBack = new THREE.MeshLambertMaterial( {
	color: "rgb(255,255,255)", // white
  //color: "rgb(180,180,180)", // grey
} );

var phongMaterialBoxBottom = new THREE.MeshLambertMaterial( {
	color: "rgb(180,180,180)", // grey
} );

var phongMaterialBoxLeft = new THREE.MeshLambertMaterial( {
	//color: "rgb(200,0,0)",
  color: "rgb(0, 130, 230)", // blue
} );

var phongMaterialBoxRight = new THREE.MeshLambertMaterial( {
	//color: "rgb(0,200,0)",
  color: "rgb(0, 130, 230)", // blue
} );

var phongMaterial = new THREE.MeshPhongMaterial( {
	color: "rgb(150,190,220)",
	specular: "rgb(255,255,255)",
	shininess: 1000,
	} );

var mirrorMaterial = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(255,255,255)",
	shininess: 1000,
} );
mirrorMaterial.mirror = true;
mirrorMaterial.reflectivity = 1;

var mirrorMaterialDark = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(170,170,170)",
	shininess: 10000,
} );
mirrorMaterialDark.mirror = true;
mirrorMaterialDark.reflectivity = 1;

var mirrorMaterialSmooth = new THREE.MeshPhongMaterial( {
	color: "rgb(255,170,0)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );
mirrorMaterialSmooth.mirror = true;
mirrorMaterialSmooth.reflectivity = 0.1;

var glassMaterialSmooth = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(255,255,255)",
	shininess: 10000,
} );
glassMaterialSmooth.glass = true;
glassMaterialSmooth.reflectivity = 0.25;
glassMaterialSmooth.refractionRatio = 1.5;

var cylindersMaterial = new THREE.MeshPhongMaterial( {
	color: "rgb(150,190,220)",
	//specular: "rgb(255,255,255)",
	//shininess: 1000,
	} );

// geometries
var sphereGeometry = new THREE.SphereGeometry( 1, 24, 24 );
var planeGeometry = new THREE.BoxGeometry( 6.00, 0.05, 6.00 );
var planeGeometry2 = new THREE.BoxGeometry( 6.00, 0.05, 3.00 );
var backMirrorGeometry = new THREE.BoxGeometry( 4.50, 0.05, 3.00 );
var boxGeometry = new THREE.BoxGeometry( 1.00, 1.00, 1.00 );
var cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 80);

// Base Cylinders
var cylinders = [];
// create the cylinders
for (let i = 0; i < 3; i++) {
  cylinders[i] = new THREE.Mesh( cylinderGeometry, cylindersMaterial );
  scene.add(cylinders[i]);
}
// cylinder positioning
cylinders[0].position.set( 0.0, 0.5, -3.0 ); // back-center
cylinders[1].position.set( 2.0, 0.5, -1.5 ); // left
cylinders[2].position.set( -2.0, 0.5, -1.5 ); // right

// Sphere
var sphere = new THREE.Mesh( sphereGeometry, phongMaterial );
sphere.scale.multiplyScalar( 0.5 );
sphere.position.set( -0.5, 0, -0.75 );
//scene.add( sphere );

// Mirror Sphere
var sphere2 = new THREE.Mesh( sphereGeometry, mirrorMaterialSmooth );
sphere2.scale.multiplyScalar( 0.8 );
sphere2.position.set( 1.75, .30, -1.50 );
//scene.add( sphere2 );

// Glass Sphere (black-right-front)
var glass = new THREE.Mesh( sphereGeometry, glassMaterialSmooth );
glass.scale.multiplyScalar( 0.5 );
glass.position.set( 1.20, 0, -.50 );
glass.rotation.y = 0.6;
//scene.add( glass );

// Box
var box = new THREE.Mesh( boxGeometry, mirrorMaterial );
box.position.set( -1.75, 0, -1.90 );
box.rotation.y = degreesToRadians(37);
//scene.add( box );

// Back Mirror
var backmirror = new THREE.Mesh( backMirrorGeometry, mirrorMaterialDark );
backmirror.rotation.x = 1.57;
backmirror.position.set( 0, 1.50, -2.90 );
backmirror.scale.multiplyScalar( 0.95 );
//scene.add( backmirror );

// bottom
var plane = new THREE.Mesh( planeGeometry, phongMaterialBoxBottom );
//plane.position.set( 0, -.5, -3.00 );
plane.position.set( 0, -.0, -3.00 );
scene.add( plane );

// top
var plane = new THREE.Mesh( planeGeometry, phongMaterialBox );
//plane.position.set( 0, 5.5, -3.00 );
//plane.position.set( 0, 2.75, -3.00 );
plane.position.set( 0, 3.0, -3.00 );
scene.add( plane );

// back
var plane = new THREE.Mesh( planeGeometry2, phongMaterialBoxBack );
plane.rotation.x = 1.57;
//plane.position.set( 0, 2.50, -3.00 );
//plane.position.set( 0, 1.50, -4.00 );
plane.position.set( 0, 1.50, -6.00 );
scene.add( plane );

// left
var plane = new THREE.Mesh( planeGeometry2, phongMaterialBoxLeft );
plane.rotation.z = 1.57;
plane.rotation.x = 1.57;
//plane.position.set( -3.00, 2.50, -3.00 )
plane.position.set( -3.00, 1.50, -3.00 )
scene.add( plane );

// right
var plane = new THREE.Mesh( planeGeometry2, phongMaterialBoxRight );
plane.rotation.z = 1.57;
plane.rotation.x = 1.57;
//plane.position.set( 3.00, 2.50, -3.00 )
plane.position.set( 3.00, 1.50, -3.00 )
scene.add( plane );

render();

function render()
{
	renderer.render( scene, camera );
}
