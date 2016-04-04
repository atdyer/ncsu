function screen_to_local( orbit_scene, x, y ) {

    // Get the screen coordinates normalized
    var vector = new THREE.Vector3(
        ( x / orbit_scene.width ) * 2 - 1,
        -( y / orbit_scene.height ) * 2 + 1,
        0.0
    );

    // Convert normalized screen coordinates to world coordinates
    // and project onto the z=0 plane of the tiltScene
    vector.unproject( orbit_scene.camera ).setZ( 0 );
    vector.setY( vector.y / Math.sin( Math.PI/2 - orbit_scene.tiltScene.getWorldRotation().x ) );

    // Get the point on the z=0 plane in global coordinates
    orbit_scene.tiltScene.localToWorld( vector );

    // Get the global coordinates in local mesh coordinates
    orbit_scene.panScene.worldToLocal( vector );

    return vector;

}