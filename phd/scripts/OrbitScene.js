/**
 * Created by tristan on 10/17/15.
 */

ADCIRC.OrbitScene = function( canvas ) {


    //// The canvas DOM on which rendering will occur
    this.canvas = canvas;
    this.dom = canvas[0];


    //// The renderer that performs rendering
    this.renderer = new THREE.WebGLRenderer(
        {
            canvas: this.dom,
            antialias: false,
            alpha: true
        }
    );

    // Set up default rendering colors/resolution
    var pixratio = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio( pixratio );
    this.renderer.setClearColor( new THREE.Color( 0x666666 ) );


    //// Create the camera
    this.width = canvas.width();
    this.height = canvas.height();
    this.camera = new THREE.OrthographicCamera(
        -canvas.width() / 2,
        canvas.width() / 2,
        canvas.height() / 2,
        -canvas.height() / 2,
        -1000000,
        1000000
    );

    // Position the camera
    this.camera.position.z = 1;
    this.camera.up.set( 0, 0, 1 );


    //// Create the scene Graph
    this.tiltScene = new THREE.Scene();
    this.rotateScene = new THREE.Scene();
    this.panScene = new THREE.Scene();

    this.rotateScene.add( this.panScene );
    this.tiltScene.add( this.rotateScene );


    //// Build the axis helper
    this.axes = new THREE.AxisHelper();
    this.sphere = new THREE.AxisHelper();
    this.rotateScene.add( this.axes );
    this.rotateScene.add( this.sphere );
    this.axes.visible = false;
    this.sphere.visible = false;

    //// Add some stuff to show scene graph
    //var pangeo = new THREE.BoxGeometry( 50, 50, 50 );
    //var panmat = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true, wireframeLinewidth: 3} );
    //var pancube = new THREE.Mesh( pangeo, panmat );
    //var panbox = new THREE.BoxHelper();
    //panbox.material.color.setRGB( 0, 1, 0 );
    ////panbox.scale.set( 50, 50, 50 );
    //this.panScene.add( panbox );

    var tiltsphere = new THREE.SphereGeometry( 50, 50, 50 );
    var tiltobject = new THREE.Mesh( tiltsphere, new THREE.MeshBasicMaterial(0x00ff00) );
    var tiltbox = new THREE.BoxHelper( tiltobject );
    tiltbox.material.color.setRGB( 1, 0, 0);
    tiltbox.material.linewidth = 3;
    this.tiltScene.add( tiltbox );

    var rotatesphere = new THREE.SphereGeometry( 30, 30, 30 );
    var rotateobject = new THREE.Mesh( rotatesphere, new THREE.MeshBasicMaterial(0x00ff00) );
    var rotatebox = new THREE.BoxHelper( rotateobject );
    rotatebox.material.color.setRGB( 0, 1, 0);
    rotatebox.material.linewidth = 3;
    this.rotateScene.add( rotatebox );

    var pansphere = new THREE.SphereGeometry( 10, 10, 10 );
    var panobject = new THREE.Mesh( pansphere, new THREE.MeshBasicMaterial(0x00ff00) );
    var panbox = new THREE.BoxHelper( panobject );
    panbox.material.color.setRGB( 0, 0, 1);
    panbox.material.linewidth = 3;
    this.panScene.add( panbox );

};

//// Constructor
ADCIRC.OrbitScene.constructor = ADCIRC.OrbitScene;


//// Prototype
ADCIRC.OrbitScene.prototype = Object.create( THREE.Scene.prototype );

ADCIRC.OrbitScene.prototype.add = function ( object ) {

    return this.panScene.add( object );

};

ADCIRC.OrbitScene.prototype.hideAxisHelper = function () {

    //this.axes.visible = false;
    //this.sphere.visible = false;
    //this.repaint();

};

ADCIRC.OrbitScene.prototype.remove = function ( object ) {

    this.panScene.remove( object );

};

ADCIRC.OrbitScene.prototype.repaint = function () {

    this.renderer.render( this.tiltScene, this.camera );

};

ADCIRC.OrbitScene.prototype.reset = function () {

    for ( var i = 0, l = this.panScene.children.length; i < l; ++i ) {

        this.panScene.remove( this.panScene.children[ i ] );

    }

    this.axes.scale.set( 1, 1, 1 );
    this.sphere.scale.set( 1, 1, 1 );
    this.dispatchEvent( { type: 'reset' } );

};

ADCIRC.OrbitScene.prototype.resize = function ( width, height ) {

    this.width = width;
    this.height = height;
    this.renderer.setSize( width, height );
    this.updateViewport();

};

ADCIRC.OrbitScene.prototype.scaleAxisHelper = function ( scale, direction ) {

    if ( direction > 0 ) {
        this.axes.scale.multiplyScalar( scale );
        this.sphere.scale.multiplyScalar( scale );
    } else {
        this.axes.scale.divideScalar( scale );
        this.sphere.scale.divideScalar( scale );
    }


};

ADCIRC.OrbitScene.prototype.showAxisHelper = function () {

    //this.axes.visible = false;
    //this.sphere.visible = false;
    //this.repaint();

};

ADCIRC.OrbitScene.prototype.updateViewport = function( left, right, top, bottom ) {

    // If any of the bounds haven't been specified, use
    // the current camera bounds
    if ( left === undefined || right === undefined || top === undefined || bottom === undefined ) {

        left = this.camera.left;
        right = this.camera.right;
        top = this.camera.top;
        bottom = this.camera.bottom;

    }

    // Update the axis helper scale
    var scale = 1 / this.camera.zoom;
    this.axes.scale.set( scale, scale, scale );
    this.sphere.scale.set( scale, scale, scale );
    this.axes.scale.multiplyScalar( ( top - bottom ) / 10 );
    this.sphere.scale.multiplyScalar( ( top - bottom ) / 14 );

    // To keep things simple, we'll always scale the camera
    // to the height of the viewport
    var hcenter = ( right + left ) / 2;
    var w = ( this.width / this.height ) * ( top - bottom );
    this.camera.left = ( hcenter - w / 2 );
    this.camera.right = ( hcenter + w / 2 );
    this.camera.top = top;
    this.camera.bottom = bottom;

    // Update the projection matrix
    this.camera.updateProjectionMatrix();

    // Repaint
    this.repaint();

};