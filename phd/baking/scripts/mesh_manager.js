//// Create the mesh
self.mesh = new ADCIRC.Mesh( self.fort14Input.files[0] );


//// Add event listeners
//   Handled
self.mesh.addEventListener( 'bbox', onBoundingBoxChange );
self.mesh.addEventListener( 'objectadded', onAddObject );
self.mesh.addEventListener( 'requestpaint', onRequestRepaint );
//   Propagated
self.mesh.addEventListener( 'error', function( e ) { self.dispatchEvent( e ); } );
self.mesh.addEventListener( 'loadcomplete', function( e ) { self.dispatchEvent( e ); } );
self.mesh.addEventListener( 'loadprogress', function( e ) { self.dispatchEvent( e ); } );
self.mesh.addEventListener( 'loadstart', function( e ) { self.dispatchEvent( e ); } );
self.mesh.addEventListener( 'meshinfo', function( e ) { self.dispatchEvent( e ); } );
self.mesh.addEventListener( 'timeseriesinfo', function( e ) { self.dispatchEvent( e ); } );


//// Add the mesh to the scene
self.scene.add( self.mesh );
