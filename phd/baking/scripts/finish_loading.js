this.finishLoading = function () {

    // Everything's been loaded, so we need to calculate the mesh offset
    // and apply it to everything that came from the mesh

    var geometry = self.adcirc_mesh.geometry;
    var mesh = self.adcirc_mesh.mesh;

    // Calculate bounding box
    var bbox = new THREE.Box3().setFromObject(mesh);

    if (!!geometry && !!mesh) {

        //// Calculate offset
        var offset = geometry.boundingBox.center().negate();
        offset.z = 0;
        var offsetmatrix = new THREE.Matrix4().setPosition(offset);


        //// Calculate an appropriate scaling factor for the x- and y- coordinates.
        //// With ADCIRC data, x and y scales are typically much larger than z scales.
        var horizontal_scale = 10 *
            ( geometry.boundingBox.max.z - geometry.boundingBox.min.z ) /
            Math.min(geometry.boundingBox.max.x - geometry.boundingBox.min.x,
                geometry.boundingBox.max.y - geometry.boundingBox.min.y);


        //// Apply offset and scaling
        self.setOffsetScale(offsetmatrix, horizontal_scale, 1);


        //// Get the bounding box of the scaled geometry and emit event
        boundingBoxEvent.bbox = new THREE.Box3().setFromObject(mesh);
        console.log(boundingBoxEvent.bbox);
        self.dispatchEvent(boundingBoxEvent);

    }
};