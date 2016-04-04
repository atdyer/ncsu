/**
 * Created by tristan on 10/9/15.
 */

var ADCIRC = {};

ADCIRC.GLCanvas = function ( dom_element ) {

    this.canvas = dom_element;
    this.scene = new ADCIRC.OrbitScene( this.canvas );
    this.controls = new ADCIRC.OrbitControls( this.scene );

    //// Scoping
    var self = this;

    //// Create event listeners
    this.controls.addEventListener( 'start', function () {
        self.scene.showAxisHelper();
    });

    this.controls.addEventListener( 'end', function () {
        self.scene.hideAxisHelper();
    });

    this.controls.addEventListener( 'scroll', function( event ) {
        self.scene.scaleAxisHelper( event.scrollSpeed, event.direction );
    });

    this.scene.addEventListener( 'reset', function () {
        self.controls.reset();
    });

};
