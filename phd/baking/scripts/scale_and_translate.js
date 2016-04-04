function scale_and_translate ( mesh, vector ) {

    vector.divideScalar( mesh.fort14.horizontal_scale );
    vector.applyMatrix4( ( new THREE.Matrix4() ).getInverse( mesh.fort14.offset ) );

}