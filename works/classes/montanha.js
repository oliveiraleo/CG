import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
/*import {initRenderer, 
    //createGroundPlaneWired,
    onWindowResize, 
    degreesToRadians,
    //initDefaultBasicLight,
    initCamera,
    //BufferGeometry,
    //ConvexGeometry,
    InfoBox} from "../libs/util/util.js";*/

//-----------------------------------//
// MOUNTAINS CONFIGURATION BEGIN     //
//-----------------------------------//
var p1 = new THREE.Vector3( 0, 1, 0 );
var p2 = new THREE.Vector3( 0, 100, 0 );
var p3 = new THREE.Vector3( 0, 100, 10 );
var p4 = new THREE.Vector3( 0, 100, 1 );
var p5 = new THREE.Vector3( 100, 0, 1 );
var p6 = new THREE.Vector3( 0, 10, 1 );
var points = [p1, p2, p3, p4, p5, p6];
var geometry = new ConvexGeometry( points );
//var geometry = new THREE.ConvexBufferGeometry(points);
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );
//-----------------------------------//
// MOUNTAINS CONFIGURATION END       //
//-----------------------------------//