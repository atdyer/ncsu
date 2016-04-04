this.setOffsetScale = function ( offset, horizontal_scale, vertical_scale ) {

    self.offset = offset;
    self.horizontal_scale = horizontal_scale;
    self.vertical_scale = vertical_scale;

    self.adcirc_mesh.geometry.applyMatrix( offset );
    self.adcirc_mesh.mesh.scale.set( horizontal_scale, horizontal_scale, vertical_scale );

    for ( i=0, l=self.adcirc_mesh.open_segments.segments.length; i&ltl; ++i ) {

        self.adcirc_mesh.open_segments.segments[i].geometry.applyMatrix( offset );
        self.adcirc_mesh.open_segments.segments[i].line.scale.set( horizontal_scale, horizontal_scale, vertical_scale );

    }

    for ( var i=0, l=self.adcirc_mesh.land_segments.segments.length; i&ltl; ++i ) {

        self.adcirc_mesh.land_segments.segments[i].geometry.applyMatrix( offset );
        self.adcirc_mesh.land_segments.segments[i].line.scale.set( horizontal_scale, horizontal_scale, vertical_scale );

    }

};
