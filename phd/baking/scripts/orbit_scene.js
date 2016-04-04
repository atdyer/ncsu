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